import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui';
import { colors, fonts, radii, space } from '../design/tokens';

const VOTE_QUESTION = '민바오는 민재 바보오 일까 민재 푸바오일까';
const VOTE_OPTIONS = ['민재 바보오다 (민바보)', '민재 푸바오다 (민바오)'];

const MEETING_TOPIC_LINES = ['학급 회의', '이번달 대의원회의 주제는', '어떻게 하면 체육대회를', '잘 놀 수 잇을까?????'];

const TABS = ['전체', '투표', '회의'] as const;

const POSTS = [
  { id: 1, title: '민바오는 민재 바보오 일까 민재 푸바오 일까~~~~~~~', date: '2026.04.23', tag: '투표' },
  { id: 2, title: '체육대회 종목 의견 받습니다 (2회차)', date: '2026.04.22', tag: '회의' },
  { id: 3, title: '현장학습 장소 선호도 투표', date: '2026.04.21', tag: '투표' },
  { id: 4, title: '학급 MT 일정 조율 회의록', date: '2026.04.20', tag: '회의' },
  { id: 5, title: '반티 디자인 최종 확정 투표', date: '2026.04.19', tag: '투표' },
] as const;

function BallotIcon() {
  return (
    <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
      <rect x="0.75" y="0.75" width="20.5" height="22.5" rx="3" stroke={colors.primary} strokeWidth="1.5" />
      <rect x="4" y="6" width="6" height="4" rx="1" fill={colors.primary} />
      <rect x="12" y="6" width="6" height="4" rx="1" fill={colors.primary} />
      <rect x="4" y="14" width="6" height="4" rx="1" fill={colors.primary} />
      <rect x="12" y="14" width="6" height="4" rx="1" fill={colors.primary} />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10V14L7 15L10 20L12 19L11 15H13V9H11L12 5L10 4L7 9L3 10Z"
        fill={colors.white}
        stroke={colors.white}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M17 8C18 9 19 10.5 19 12C19 13.5 18 15 17 16" stroke={colors.white} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Classroom() {
  const [vote, setVote] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('전체');

  const filteredPosts = POSTS.filter((p) => (activeTab === '전체' ? true : p.tag === activeTab));
  const voteResults = voted ? [62, 38] : null;

  return (
    <DashboardLayout activePath="/classroom" sidebarTop={180} fillWidth>
      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 148,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.md,
            color: colors.primaryDark,
            fontWeight: fonts.weight.medium,
            letterSpacing: '0.2px',
          }}
        >
          우리 반
        </div>
        <div
          style={{
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size['3xl'],
            color: colors.text.primary,
            fontWeight: fonts.weight.bold,
          }}
        >
          학급
        </div>
      </div>

      <Card
        variant="surface"
        radius="xl"
        elevated
        style={{
          position: 'absolute',
          left: 200,
          top: 240,
          width: 600,
          padding: `${space[5]}px ${space[6]}px ${space[6]}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: space[3],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
          <BallotIcon />
          <span
            style={{
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.semibold,
              color: colors.primaryDark,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            진행중인 투표
          </span>
        </div>
        <div
          style={{
            fontFamily: fonts.family.pretendard,
            fontSize: fonts.size.lg,
            fontWeight: fonts.weight.bold,
            color: colors.text.primary,
            lineHeight: 1.35,
          }}
        >
          {VOTE_QUESTION}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space[2], marginTop: space[2] }}>
          {VOTE_OPTIONS.map((option, i) => {
            const selected = vote === i;
            const percent = voteResults?.[i] ?? 0;
            return (
              <button
                key={option}
                onClick={() => !voted && setVote(i)}
                disabled={voted}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 48,
                  padding: `0 ${space[4]}px`,
                  background: selected ? colors.primarySoft : colors.surface.muted,
                  border: `2px solid ${selected ? colors.primary : 'transparent'}`,
                  borderRadius: radii.md,
                  cursor: voted ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: space[3],
                  transition: 'background 0.15s, border-color 0.15s',
                  overflow: 'hidden',
                }}
              >
                {voted && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${percent}%`,
                      background: selected ? 'rgba(253,203,53,0.28)' : 'rgba(0,0,0,0.05)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                )}
                <div
                  style={{
                    position: 'relative',
                    width: 18,
                    height: 18,
                    borderRadius: radii.full,
                    border: `2px solid ${selected ? colors.primary : colors.border.soft}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {selected && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: radii.full,
                        background: colors.primary,
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    position: 'relative',
                    fontFamily: fonts.family.pretendard,
                    fontSize: fonts.size.base,
                    fontWeight: fonts.weight.semibold,
                    color: colors.text.primary,
                    flex: 1,
                    textAlign: 'left',
                  }}
                >
                  {option}
                </span>
                {voted && (
                  <span
                    style={{
                      position: 'relative',
                      fontFamily: fonts.family.inter,
                      fontSize: fonts.size.sm,
                      fontWeight: fonts.weight.bold,
                      color: selected ? colors.primaryDark : colors.text.secondary,
                    }}
                  >
                    {percent}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => vote !== null && setVoted(true)}
          disabled={vote === null || voted}
          style={{
            height: 44,
            background: vote === null || voted ? colors.surface.muted : colors.primary,
            color: vote === null || voted ? colors.text.muted : colors.text.primary,
            border: 'none',
            borderRadius: radii.md,
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size.md,
            fontWeight: fonts.weight.bold,
            cursor: vote === null || voted ? 'not-allowed' : 'pointer',
            marginTop: space[2],
            transition: 'background 0.15s',
          }}
        >
          {voted ? '투표 완료 · 참여해주셔서 감사합니다' : '투표하기'}
        </button>
      </Card>

      <Card
        variant="surface"
        radius="xl"
        style={{
          position: 'absolute',
          left: 820,
          top: 240,
          width: 520,
          padding: space[6],
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          color: colors.white,
          overflow: 'hidden',
        }}
        elevated
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: space[2],
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          <MegaphoneIcon />
          <span
            style={{
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.semibold,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            이번 달 대의원회의
          </span>
        </div>
        <div
          style={{
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size['2xl'],
            fontWeight: fonts.weight.bold,
            lineHeight: 1.22,
            marginTop: space[4],
            textShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          {MEETING_TOPIC_LINES.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: space[2],
            marginTop: space[5],
            padding: '6px 14px',
            background: 'rgba(255,255,255,0.22)',
            borderRadius: radii.full,
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.sm,
            fontWeight: fonts.weight.semibold,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span
            style={{ width: 8, height: 8, borderRadius: radii.full, background: colors.white }}
          />
          04.28 (목) 7교시
        </div>
      </Card>

      <Card
        variant="surface"
        radius="xl"
        elevated
        style={{
          position: 'absolute',
          left: 200,
          top: 620,
          width: 1140,
          padding: `${space[5]}px ${space[6]}px ${space[6]}px`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: space[4],
          }}
        >
          <div style={{ display: 'flex', gap: space[5], position: 'relative' }}>
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: `${space[1]}px 0`,
                    cursor: 'pointer',
                    fontFamily: fonts.family.laundry,
                    fontSize: fonts.size.md,
                    fontWeight: fonts.weight.semibold,
                    color: active ? colors.text.primary : colors.text.muted,
                    borderBottom: `3px solid ${active ? colors.primary : 'transparent'}`,
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
              color: colors.text.secondary,
              fontWeight: fonts.weight.medium,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = colors.primaryDark)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = colors.text.secondary)}
          >
            더보기 ›
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filteredPosts.length === 0 ? (
            <div
              style={{
                padding: `${space[6]}px 0`,
                textAlign: 'center',
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.sm,
                color: colors.text.secondary,
              }}
            >
              해당 탭의 게시물이 없습니다.
            </div>
          ) : (
            filteredPosts.map((post, i) => (
              <div
                key={post.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: space[3],
                  padding: `${space[3]}px 0`,
                  borderTop: i === 0 ? 'none' : `1px solid ${colors.border.default}`,
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = 'rgba(253,203,53,0.06)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = 'transparent')
                }
              >
                <div
                  style={{
                    padding: '3px 10px',
                    borderRadius: radii.full,
                    background: post.tag === '투표' ? colors.primarySoft : 'rgba(47,168,75,0.12)',
                    color: post.tag === '투표' ? colors.primaryDark : colors.state.success,
                    fontFamily: fonts.family.inter,
                    fontSize: fonts.size.xs,
                    fontWeight: fonts.weight.bold,
                    flexShrink: 0,
                    width: 48,
                    textAlign: 'center',
                  }}
                >
                  {post.tag}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontFamily: fonts.family.pretendard,
                    fontSize: fonts.size.base,
                    color: colors.text.primary,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: fonts.weight.medium,
                  }}
                >
                  {post.title}
                </div>
                <div
                  style={{
                    fontFamily: fonts.family.inter,
                    fontSize: fonts.size.sm,
                    color: colors.text.secondary,
                    flexShrink: 0,
                  }}
                >
                  {post.date}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

    </DashboardLayout>
  );
}
