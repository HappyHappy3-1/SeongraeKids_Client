import { useEffect, useMemo, useRef, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui';
import { COLORS, FONTS } from '../constants';
import { colors, fonts, radii, space, zIndex } from '../design/tokens';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  listRecruitmentPosts,
  type RecruitmentPost,
} from '../api/recruitment';

function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function JobCard({
  post,
  onClick,
}: {
  post: RecruitmentPost;
  onClick: () => void;
}) {
  const d = daysLeft(post.deadline);
  const dday =
    d === null
      ? '모집중'
      : d < 0
        ? '마감'
        : d === 0
          ? 'D-DAY'
          : `D-${d}`;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${post.company_name} 공고, ${dday}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        height: 200,
        background: COLORS.darkCard,
        color: colors.white,
        borderRadius: radii.md,
        padding: space[5],
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontFamily: FONTS.inter,
        transition: 'transform 0.15s, box-shadow 0.15s',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 12px 28px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          fontSize: fonts.size.xs,
          fontWeight: fonts.weight.bold,
          color: d !== null && d < 0 ? 'rgba(255,255,255,0.45)' : colors.primary,
        }}
      >
        {dday}
        {post.military_service_available && (
          <span
            style={{
              marginLeft: 6,
              fontWeight: fonts.weight.medium,
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            · 병역 가능
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: fonts.size.xs,
          color: 'rgba(255,255,255,0.6)',
          marginTop: 2,
        }}
      >
        회사명
      </div>
      <div
        style={{
          fontFamily: FONTS.laundry,
          fontSize: fonts.size.xl,
          fontWeight: fonts.weight.bold,
          color: colors.primary,
          lineHeight: 1.15,
          marginTop: 2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {post.company_name}
      </div>
      <div
        style={{
          height: 1,
          background: 'rgba(255,255,255,0.18)',
          margin: `${space[2]}px 0`,
        }}
      />
      <div
        style={{
          fontSize: fonts.size.sm,
          color: 'rgba(255,255,255,0.78)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: space[2],
        }}
      >
        <span>{post.headcount}명 채용</span>
        {post.deadline && (
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>~{post.deadline}</span>
        )}
      </div>
      <div
        style={{
          fontSize: fonts.size.xs,
          color: 'rgba(255,255,255,0.55)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {post.location}
      </div>
    </div>
  );
}

function DetailModal({
  post,
  onClose,
}: {
  post: RecruitmentPost;
  onClose: () => void;
}) {
  useEscapeKey(onClose);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef);
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.62)',
        backdropFilter: 'blur(4px)',
        zIndex: zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${post.company_name} 공고 상세`}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, 100%)',
          maxHeight: '86vh',
          background: colors.surface.dark,
          borderRadius: radii.xl,
          padding: `${space[8]}px ${space[8]}px ${space[6]}px`,
          color: colors.white,
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: radii.full,
            border: 'none',
            background: 'rgba(255,255,255,0.12)',
            color: colors.white,
            cursor: 'pointer',
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <div style={{ fontSize: fonts.size.sm, color: 'rgba(255,255,255,0.72)' }}>
          회사명
        </div>
        <div
          style={{
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size['3xl'],
            fontWeight: fonts.weight.bold,
            color: colors.primary,
            marginBottom: space[5],
          }}
        >
          {post.company_name}
        </div>
        <div
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.22)',
            marginBottom: space[5],
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
          <div style={{ display: 'flex', gap: space[5] }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: fonts.family.inter,
                  fontSize: fonts.size.base,
                  fontWeight: fonts.weight.bold,
                  marginBottom: 6,
                }}
              >
                채용 인원
              </div>
              <div style={{ color: 'rgba(255,255,255,0.78)' }}>
                {post.headcount}명
              </div>
            </div>
            {post.deadline && (
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: fonts.family.inter,
                    fontSize: fonts.size.base,
                    fontWeight: fonts.weight.bold,
                    marginBottom: 6,
                  }}
                >
                  마감일
                </div>
                <div style={{ color: colors.primary, fontWeight: fonts.weight.bold }}>
                  {post.deadline}
                </div>
              </div>
            )}
          </div>
          <div>
            <div
              style={{
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.base,
                fontWeight: fonts.weight.bold,
                marginBottom: 6,
              }}
            >
              회사 위치
            </div>
            <div style={{ color: 'rgba(255,255,255,0.78)' }}>{post.location}</div>
          </div>
          {post.classroom_link && (
            <div>
              <div
                style={{
                  fontFamily: fonts.family.inter,
                  fontSize: fonts.size.base,
                  fontWeight: fonts.weight.bold,
                  marginBottom: 6,
                }}
              >
                클래스룸 링크
              </div>
              <a
                href={post.classroom_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(255,255,255,0.78)',
                  wordBreak: 'break-all',
                }}
              >
                {post.classroom_link}
              </a>
            </div>
          )}
          {post.military_service_available && (
            <div
              style={{
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.base,
                fontWeight: fonts.weight.bold,
                color: colors.primary,
              }}
            >
              병역 가능
            </div>
          )}
          {post.description && (
            <div style={{ marginTop: space[2] }}>
              <button
                onClick={() => setShowDetail((v) => !v)}
                style={{
                  width: '100%',
                  padding: `${space[2]}px ${space[3]}px`,
                  background: 'rgba(255,255,255,0.10)',
                  color: colors.white,
                  border: `1px solid rgba(255,255,255,0.18)`,
                  borderRadius: radii.md,
                  cursor: 'pointer',
                  fontFamily: fonts.family.laundry,
                  fontSize: fonts.size.md,
                  fontWeight: fonts.weight.bold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>세부 내용 보기</span>
                <span style={{ color: colors.primary }}>{showDetail ? '▲' : '▼'}</span>
              </button>
              {showDetail && (
                <div
                  style={{
                    marginTop: space[2],
                    color: 'rgba(255,255,255,0.82)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                    maxHeight: 320,
                    overflowY: 'auto',
                    padding: space[3],
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: radii.md,
                    fontSize: fonts.size.sm,
                  }}
                >
                  {post.description}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TABS = ['마감 임박', '마감'] as const;
type Tab = (typeof TABS)[number];

export default function Jobs() {
  const [posts, setPosts] = useState<RecruitmentPost[]>([]);
  const [selected, setSelected] = useState<RecruitmentPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('마감 임박');

  useEffect(() => {
    const reload = () => {
      listRecruitmentPosts()
        .then(setPosts)
        .catch((e) =>
          setError(e instanceof Error ? e.message : '공고 로드 실패'),
        );
    };
    reload();
    const onFocus = () => {
      if (document.visibilityState === 'visible') reload();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, []);

  const { active, closed } = useMemo(() => {
    const a: RecruitmentPost[] = [];
    const c: RecruitmentPost[] = [];
    for (const p of posts) {
      const d = daysLeft(p.deadline);
      if (d !== null && d < 0) c.push(p);
      else a.push(p);
    }
    a.sort((x, y) => (x.deadline ?? '').localeCompare(y.deadline ?? ''));
    c.sort((x, y) => (y.deadline ?? '').localeCompare(x.deadline ?? ''));
    return { active: a, closed: c };
  }, [posts]);

  const visible = tab === '마감 임박' ? active : closed;

  return (
    <DashboardLayout activePath="/jobs" sidebarTop={180} fillWidth>
      <div style={{ position: 'absolute', left: 200, top: 148 }}>
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.md,
            color: colors.primaryDark,
            fontWeight: fonts.weight.medium,
          }}
        >
          우리학교 취업 공고
        </div>
        <div
          style={{
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size['3xl'],
            color: colors.text.primary,
            fontWeight: fonts.weight.bold,
            marginTop: 6,
          }}
        >
          취업 의뢰
        </div>
      </div>

      <div
        role="tablist"
        aria-label="공고 상태 탭"
        style={{
          position: 'absolute',
          left: 200,
          top: 240,
          display: 'flex',
          gap: space[6],
        }}
      >
        {TABS.map((t) => {
          const on = tab === t;
          const count = t === '마감 임박' ? active.length : closed.length;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: `${space[2]}px 0`,
                cursor: 'pointer',
                fontFamily: fonts.family.laundry,
                fontSize: fonts.size.lg,
                fontWeight: fonts.weight.bold,
                color: on ? colors.text.primary : colors.text.muted,
                borderBottom: `4px solid ${on ? colors.primary : 'transparent'}`,
              }}
            >
              {t === '마감 임박' ? '마감 임박 취업 의뢰 공고' : '마감된 취업 의뢰 공고'}
              <span
                style={{
                  marginLeft: 8,
                  fontSize: fonts.size.sm,
                  color: colors.text.secondary,
                  fontWeight: fonts.weight.medium,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div
          style={{
            position: 'absolute',
            left: 200,
            top: 300,
            padding: space[2],
            background: '#FFE7E7',
            color: colors.state.danger,
            borderRadius: radii.md,
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.sm,
          }}
        >
          {error}
        </div>
      )}

      <Card
        variant="surface"
        radius="xl"
        elevated
        style={{
          position: 'absolute',
          left: 200,
          top: 320,
          width: 1140,
          padding: space[5],
          minHeight: 400,
        }}
      >
        {visible.length === 0 ? (
          <div
            style={{
              padding: space[8],
              textAlign: 'center',
              fontFamily: fonts.family.inter,
              color: colors.text.secondary,
            }}
          >
            {tab === '마감 임박' ? '마감 임박 공고가 없습니다.' : '마감된 공고가 없습니다.'}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: space[3],
            }}
          >
            {visible.map((p) => (
              <JobCard key={p.id} post={p} onClick={() => setSelected(p)} />
            ))}
          </div>
        )}
      </Card>

      {selected && <DetailModal post={selected} onClose={() => setSelected(null)} />}
    </DashboardLayout>
  );
}
