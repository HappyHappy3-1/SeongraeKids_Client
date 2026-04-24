import { useEffect, useRef, useState } from 'react';
import { colors, fonts, radii } from '../design/tokens';

interface Props {
  portfolioId: string;
  resolveUrl: () => Promise<string>;
}

const THUMB_WIDTH = 260;
const THUMB_HEIGHT = 150;
const CACHE_PREFIX = 'pdf-thumb:';

function getCached(id: string): string | null {
  try {
    return sessionStorage.getItem(CACHE_PREFIX + id);
  } catch {
    return null;
  }
}

function setCached(id: string, dataUrl: string): void {
  try {
    sessionStorage.setItem(CACHE_PREFIX + id, dataUrl);
  } catch {
    /* quota exceeded — skip */
  }
}

export default function PortfolioThumbnail({ portfolioId, resolveUrl }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(() => getCached(portfolioId));
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    if (dataUrl) return;
    (async () => {
      try {
        const [{ default: workerSrc }, pdfjs] = await Promise.all([
          import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
          import('pdfjs-dist'),
        ]);
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
        const url = await resolveUrl();
        if (cancelledRef.current) return;
        const doc = await pdfjs.getDocument(url).promise;
        if (cancelledRef.current) {
          doc.destroy();
          return;
        }
        const page = await doc.getPage(1);
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = THUMB_WIDTH / baseViewport.width;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = viewport.width * ratio;
        canvas.height = viewport.height * ratio;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        if (cancelledRef.current) {
          doc.destroy();
          return;
        }
        const url2 = canvas.toDataURL('image/jpeg', 0.75);
        setCached(portfolioId, url2);
        setDataUrl(url2);
        doc.destroy();
      } catch (e) {
        if (!cancelledRef.current) {
          setError(e instanceof Error ? e.message : '썸네일 생성 실패');
        }
      }
    })();
    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioId]);

  if (dataUrl) {
    return (
      <img
        src={dataUrl}
        alt=""
        style={{
          width: '100%',
          height: THUMB_HEIGHT,
          objectFit: 'cover',
          objectPosition: 'top center',
          borderRadius: radii.md,
          background: colors.surface.muted,
          display: 'block',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: THUMB_HEIGHT,
        borderRadius: radii.md,
        background: colors.primarySoft,
        color: colors.primaryDark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts.family.inter,
        fontSize: fonts.size.xs,
        fontWeight: fonts.weight.bold,
      }}
    >
      {error ? '썸네일 없음' : 'PDF 렌더링 중…'}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
