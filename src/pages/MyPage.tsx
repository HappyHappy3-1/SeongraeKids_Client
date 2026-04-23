import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import PdfSlideViewer from '../components/PdfSlideViewer';
import { Button, Card } from '../components/ui';
import { colors, fonts, radii, shadows, space } from '../design/tokens';
import { ROLE_LABELS, toBackendRole, type UserRole } from '../constants';
import { setMyRole } from '../api/auth';
import {
  getAllPortfolios,
  getMyPortfolios,
  getPortfolioDownloadUrl,
  uploadMyPortfolio,
  type PortfolioItem,
} from '../api/portfolio';

const FEEDBACK_TEXT = '빨리 정신으로 해주세요 디자인 정확했어요 ㅜㅜ';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function PdfThumb() {
  return (
    <svg width="28" height="34" viewBox="0 0 28 34" fill="none" aria-hidden>
      <path
        d="M4 2C2.9 2 2 2.9 2 4V30C2 31.1 2.9 32 4 32H24C25.1 32 26 31.1 26 30V10L18 2H4Z"
        fill={colors.primarySoft}
        stroke={colors.primaryDark}
        strokeWidth="1.5"
      />
      <path d="M18 2V10H26" stroke={colors.primaryDark} strokeWidth="1.5" fill="none" />
      <text
        x="14"
        y="24"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="7"
        fontWeight="700"
        fill={colors.primaryDark}
      >
        PDF
      </text>
    </svg>
  );
}

function PortfolioCard({
  item,
  studentLabel,
  onPreview,
  onDownload,
}: {
  item: PortfolioItem;
  studentLabel?: string;
  onPreview: (item: PortfolioItem) => void;
  onDownload: (item: PortfolioItem) => void;
}) {
  return (
    <Card
      variant="surface"
      radius="xl"
      elevated
      style={{
        padding: space[4],
        display: 'flex',
        flexDirection: 'column',
        gap: space[3],
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = shadows.popover;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = shadows.card;
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: space[3] }}>
        <div
          style={{
            width: 52,
            height: 60,
            borderRadius: radii.md,
            background: colors.primarySoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <PdfThumb />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontFamily: fonts.family.pretendard,
              fontWeight: fonts.weight.semibold,
              fontSize: fonts.size.md,
              color: colors.text.primary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={item.originalName}
          >
            {item.originalName}
          </div>
          {studentLabel && (
            <div
              style={{
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.xs,
                color: colors.primaryDark,
                fontWeight: fonts.weight.semibold,
                marginTop: 3,
              }}
            >
              {studentLabel}
            </div>
          )}
          <div
            style={{
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.xs,
              color: colors.text.secondary,
              marginTop: 4,
            }}
          >
            {formatBytes(item.size)} · {formatDate(item.uploadedAt)}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: space[2] }}>
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => onPreview(item)}
          style={{ fontSize: fonts.size.base }}
        >
          슬라이드 보기
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onDownload(item)}
          style={{ fontSize: fonts.size.base, padding: `0 14px` }}
        >
          ↓
        </Button>
      </div>
    </Card>
  );
}

export default function MyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userName = typeof window !== 'undefined' ? localStorage.getItem('user_name') ?? '' : '';
  const role =
    (typeof window !== 'undefined'
      ? (localStorage.getItem('user_role') as UserRole | null)
      : null) ?? 'student';
  const isTeacher = role === 'teacher';

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  const loadItems = async (retried = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = isTeacher ? await getAllPortfolios() : await getMyPortfolios();
      setItems(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '목록을 불러오지 못했습니다.';
      const roleNotFound =
        !retried &&
        (msg.includes('role was not found') || msg.includes('role is missing'));
      if (roleNotFound) {
        try {
          await setMyRole(toBackendRole(role));
          await loadItems(true);
          return;
        } catch (innerErr) {
          setError(
            innerErr instanceof Error
              ? `역할 설정 실패: ${innerErr.message}`
              : '역할 설정 실패',
          );
          return;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher]);

  const handleSelectFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('PDF 파일만 업로드 가능합니다.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      await uploadMyPortfolio(file);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  const openPreview = async (item: PortfolioItem) => {
    try {
      const { url } = await getPortfolioDownloadUrl(item.id);
      setPreviewUrl(url);
      setPreviewTitle(item.originalName);
    } catch (err) {
      setError(err instanceof Error ? err.message : '미리보기 링크 생성 실패');
    }
  };

  const handleDownload = async (item: PortfolioItem) => {
    try {
      const { url } = await getPortfolioDownloadUrl(item.id);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : '다운로드 링크 생성 실패');
    }
  };

  const PAGE_X = 200;
  const CONTENT_WIDTH = 1180;

  return (
    <DashboardLayout activePath="/mypage" sidebarTop={180} fillWidth>
      <div
        style={{
          position: 'absolute',
          left: PAGE_X,
          top: 148,
          width: CONTENT_WIDTH,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: space[4],
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.md,
              fontWeight: fonts.weight.medium,
              color: colors.primaryDark,
              letterSpacing: '0.2px',
            }}
          >
            취업하자쓰!!
          </div>
          <div
            style={{
              fontFamily: fonts.family.laundry,
              fontSize: fonts.size['3xl'],
              fontWeight: fonts.weight.bold,
              color: colors.text.primary,
              marginTop: 6,
            }}
          >
            {userName ? `${userName}님 하이~` : '하이~'}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: space[2],
              marginTop: space[3],
              padding: '6px 14px',
              background: colors.primarySoft,
              color: colors.primaryDark,
              borderRadius: radii.full,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.semibold,
            }}
          >
            <span
              style={{ width: 6, height: 6, borderRadius: radii.full, background: colors.primary }}
            />
            {ROLE_LABELS[role]}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: space[3] }}>
          <Card
            variant="surface"
            radius="xl"
            elevated
            style={{
              padding: `${space[3]}px ${space[5]}px`,
              display: 'flex',
              alignItems: 'center',
              gap: space[5],
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: fonts.family.inter,
                  fontSize: fonts.size.xs,
                  color: colors.text.secondary,
                }}
              >
                등록된 포트폴리오
              </div>
              <div
                style={{
                  fontFamily: fonts.family.laundry,
                  fontSize: fonts.size.xl,
                  color: colors.text.primary,
                  fontWeight: fonts.weight.bold,
                  marginTop: 2,
                }}
              >
                {items.length}
                <span
                  style={{
                    fontSize: fonts.size.sm,
                    color: colors.text.secondary,
                    marginLeft: 4,
                  }}
                >
                  개
                </span>
              </div>
            </div>
            <div style={{ width: 1, height: 38, background: colors.border.default }} />
            <div>
              <div
                style={{
                  fontFamily: fonts.family.inter,
                  fontSize: fonts.size.xs,
                  color: colors.text.secondary,
                }}
              >
                최근 업로드
              </div>
              <div
                style={{
                  fontFamily: fonts.family.laundry,
                  fontSize: fonts.size.lg,
                  color: colors.text.primary,
                  fontWeight: fonts.weight.semibold,
                  marginTop: 2,
                }}
              >
                {items[0] ? formatDate(items[0].uploadedAt) : '—'}
              </div>
            </div>
          </Card>
          <button
            onClick={handleLogout}
            style={{
              height: 64,
              padding: '0 20px',
              background: colors.white,
              color: colors.text.secondary,
              border: `2px solid ${colors.border.default}`,
              borderRadius: radii.md,
              cursor: 'pointer',
              fontFamily: fonts.family.laundry,
              fontSize: fonts.size.md,
              fontWeight: fonts.weight.semibold,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.15s, color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#FFE7E7';
              (e.currentTarget as HTMLElement).style.color = colors.state.danger;
              (e.currentTarget as HTMLElement).style.borderColor = colors.state.danger;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = colors.white;
              (e.currentTarget as HTMLElement).style.color = colors.text.secondary;
              (e.currentTarget as HTMLElement).style.borderColor = colors.border.default;
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            로그아웃
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: PAGE_X,
          top: 308,
          width: CONTENT_WIDTH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fonts.family.laundry,
              fontSize: fonts.size.xl,
              color: colors.text.primary,
              fontWeight: fonts.weight.bold,
            }}
          >
            {isTeacher ? '학생 포트폴리오 전체 목록' : '내 포트폴리오'}
          </div>
          <div
            style={{
              marginTop: 4,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
              color: colors.text.secondary,
            }}
          >
            {isTeacher
              ? '업로드된 학생 PDF를 슬라이드로 바로 확인할 수 있습니다.'
              : '내 PDF를 슬라이드로 넘기며 발표 연습하세요.'}
          </div>
        </div>
        {!isTeacher && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button variant="primary" size="sm" disabled={uploading} onClick={handleSelectFile}>
              {uploading ? '업로드 중...' : '＋ PDF 업로드'}
            </Button>
          </>
        )}
      </div>

      {!isTeacher && (
        <button
          onClick={handleSelectFile}
          disabled={uploading}
          style={{
            position: 'absolute',
            left: PAGE_X,
            top: 372,
            width: CONTENT_WIDTH,
            height: 128,
            border: `2px dashed ${colors.border.strong}`,
            borderRadius: radii.xl,
            background: `linear-gradient(180deg, ${colors.primarySoft} 0%, rgba(253,203,53,0.06) 100%)`,
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            opacity: uploading ? 0.6 : 1,
            transition: 'background 0.15s, border-color 0.15s',
            fontFamily: fonts.family.inter,
          }}
          onMouseEnter={(e) => {
            if (!uploading) {
              (e.currentTarget as HTMLElement).style.background =
                `linear-gradient(180deg, #FFEEB5 0%, ${colors.primarySoft} 100%)`;
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              `linear-gradient(180deg, ${colors.primarySoft} 0%, rgba(253,203,53,0.06) 100%)`;
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: radii.full,
              background: colors.primary,
              color: colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: fonts.weight.bold,
              marginBottom: 4,
            }}
          >
            ＋
          </div>
          <div
            style={{
              fontSize: fonts.size.lg,
              fontWeight: fonts.weight.bold,
              color: colors.text.primary,
            }}
          >
            {uploading ? '업로드 중...' : '포트폴리오 PDF 업로드'}
          </div>
          <div style={{ fontSize: fonts.size.sm, color: colors.text.secondary }}>
            클릭해서 파일 선택 · application/pdf 전용 · 최대 20MB
          </div>
        </button>
      )}

      {error && (
        <div
          style={{
            position: 'absolute',
            left: PAGE_X,
            top: isTeacher ? 360 : 516,
            width: CONTENT_WIDTH,
            padding: space[3],
            borderRadius: radii.md,
            background: '#FFE7E7',
            color: colors.state.danger,
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.sm,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: PAGE_X,
          top: isTeacher ? 360 : 524,
          width: CONTENT_WIDTH,
        }}
      >
        {loading && items.length === 0 ? (
          <div
            style={{
              padding: space[8],
              fontFamily: fonts.family.inter,
              color: colors.text.secondary,
              textAlign: 'center',
            }}
          >
            불러오는 중...
          </div>
        ) : items.length === 0 ? (
          <Card
            variant="surface"
            radius="xl"
            style={{
              padding: space[8],
              textAlign: 'center',
              boxShadow: shadows.panel,
              border: `1px solid ${colors.border.default}`,
            }}
          >
            <div
              style={{
                fontFamily: fonts.family.laundry,
                fontSize: fonts.size.lg,
                color: colors.text.primary,
                marginBottom: space[1],
              }}
            >
              아직 업로드된 포트폴리오가 없어요
            </div>
            <div
              style={{
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.sm,
                color: colors.text.secondary,
              }}
            >
              {isTeacher
                ? '학생이 업로드하면 여기에 표시됩니다.'
                : '위의 업로드 영역을 눌러 첫 PDF를 올려보세요.'}
            </div>
          </Card>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: space[4],
            }}
          >
            {items.map((item) => (
              <PortfolioCard
                key={item.id}
                item={item}
                studentLabel={isTeacher ? `학생 · ${item.studentId.slice(0, 8)}` : undefined}
                onPreview={openPreview}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>

      {!isTeacher && (
        <div
          style={{
            position: 'absolute',
            left: PAGE_X,
            top: 860,
            width: CONTENT_WIDTH,
          }}
        >
          <div
            style={{
              fontFamily: fonts.family.laundry,
              fontSize: fonts.size.xl,
              color: colors.text.primary,
              fontWeight: fonts.weight.bold,
              marginBottom: space[3],
            }}
          >
            성래쌤의 피드백
          </div>
          <Card
            variant="surface"
            radius="xl"
            elevated
            style={{
              padding: space[5],
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.md,
              color: colors.text.primary,
              lineHeight: 1.55,
              borderLeft: `4px solid ${colors.primary}`,
            }}
          >
            {FEEDBACK_TEXT}
          </Card>
        </div>
      )}

      {previewUrl && (
        <PdfSlideViewer
          url={previewUrl}
          title={previewTitle}
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </DashboardLayout>
  );
}
