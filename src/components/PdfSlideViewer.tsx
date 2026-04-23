import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { colors, fonts, radii, shadows, space, zIndex } from '../design/tokens';
import { Button } from './ui';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

interface Props {
  url: string;
  title?: string;
  onClose: () => void;
}

export default function PdfSlideViewer({ url, title, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    pdfjsLib
      .getDocument(url)
      .promise.then((doc) => {
        if (cancelled) {
          doc.destroy();
          return;
        }
        setPdf(doc);
        setPage(1);
        setLoading(false);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'PDF를 불러오지 못했습니다.');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    if (!pdf) return;
    let cancelled = false;
    (async () => {
      const p = await pdf.getPage(page);
      if (cancelled || !canvasRef.current) return;
      const containerWidth = Math.min(window.innerWidth * 0.7, 1000);
      const baseViewport = p.getViewport({ scale: 1 });
      const scale = containerWidth / baseViewport.width;
      const viewport = p.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = viewport.width * ratio;
      canvas.height = viewport.height * ratio;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      await p.render({ canvasContext: ctx, viewport, canvas }).promise;
    })();
    return () => {
      cancelled = true;
    };
  }, [pdf, page]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') setPage((p) => Math.max(1, p - 1));
      else if (e.key === 'ArrowRight')
        setPage((p) => (pdf ? Math.min(pdf.numPages, p + 1) : p));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pdf, onClose]);

  const total = pdf?.numPages ?? 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(4px)',
        zIndex: zIndex.modal,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: space[6],
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: space[4],
          maxWidth: '90vw',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: colors.white,
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size.md,
          }}
        >
          <div
            style={{
              maxWidth: 520,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: fonts.weight.semibold,
            }}
          >
            {title ?? '포트폴리오 미리보기'}
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.white,
              fontSize: 28,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            position: 'relative',
            background: colors.white,
            borderRadius: radii.lg,
            boxShadow: shadows.float,
            minHeight: 240,
            minWidth: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading && (
            <div style={{ padding: space[8], color: colors.text.secondary, fontFamily: fonts.family.inter }}>
              PDF 로딩 중...
            </div>
          )}
          {error && (
            <div style={{ padding: space[8], color: colors.state.danger, fontFamily: fonts.family.inter }}>
              {error}
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: loading || error ? 'none' : 'block' }} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: space[4],
            padding: `${space[2]}px ${space[4]}px`,
            background: 'rgba(255,255,255,0.12)',
            borderRadius: radii.full,
            backdropFilter: 'blur(6px)',
          }}
        >
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{ minWidth: 72 }}
          >
            ‹ 이전
          </Button>
          <div
            style={{
              color: colors.white,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.md,
              fontWeight: fonts.weight.semibold,
              minWidth: 72,
              textAlign: 'center',
            }}
          >
            {page} / {total || '—'}
          </div>
          <Button
            variant="primary"
            size="sm"
            disabled={!pdf || page >= total}
            onClick={() => setPage((p) => (pdf ? Math.min(pdf.numPages, p + 1) : p))}
            style={{ minWidth: 72 }}
          >
            다음 ›
          </Button>
        </div>

        <div
          style={{
            color: 'rgba(255,255,255,0.72)',
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.xs,
          }}
        >
          ESC · 바깥 클릭 닫기 · ← → 슬라이드 이동
        </div>
      </div>
    </div>
  );
}
