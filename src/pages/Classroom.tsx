import { useEffect, useMemo, useRef, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Button, Card } from '../components/ui';
import NoticeDetailModal from '../components/NoticeDetailModal';
import { colors, fonts, radii, space, zIndex } from '../design/tokens';
import { useAuth } from '../context/AuthContext';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useToast } from '../context/ToastContext';
import {
  createPoll,
  listPolls,
  votePoll,
  type Poll,
} from '../api/polls';
import {
  createNotice,
  deleteNotice,
  listNotices,
  type Notice,
} from '../api/notices';

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

function ModalShell({
  title,
  onClose,
  children,
  onSubmit,
  submitLabel,
  submitting,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel: string;
  submitting: boolean;
}) {
  useEscapeKey(onClose);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef);
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
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
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.white,
          width: 'min(480px, 100%)',
          borderRadius: radii.xl,
          padding: space[6],
          display: 'flex',
          flexDirection: 'column',
          gap: space[3],
        }}
      >
        <div
          style={{
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size.xl,
            fontWeight: fonts.weight.bold,
            color: colors.text.primary,
          }}
        >
          {title}
        </div>
        {children}
        <div style={{ display: 'flex', gap: space[2], marginTop: space[2] }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onSubmit}
            disabled={submitting}
            style={{ flex: 1 }}
          >
            {submitting ? '저장 중…' : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CreatePollModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!title.trim()) return setError('제목을 입력해주세요.');
    const cleaned = options.map((o) => o.trim()).filter(Boolean);
    if (cleaned.length < 2) return setError('선택지를 2개 이상 입력해주세요.');
    setSubmitting(true);
    try {
      await createPoll({ title: title.trim(), options: cleaned, status: 'active' });
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : '투표 생성 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="+ 투표 만들기"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="생성"
      submitting={submitting}
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            void submit();
          }
        }}
        placeholder="투표 주제"
        style={{
          height: 44,
          padding: '0 12px',
          border: `1px solid ${colors.border.default}`,
          borderRadius: radii.md,
          fontFamily: fonts.family.pretendard,
          fontSize: fonts.size.md,
        }}
      />
      {options.map((opt, i) => (
        <input
          key={i}
          value={opt}
          onChange={(e) => {
            const next = options.slice();
            next[i] = e.target.value;
            setOptions(next);
          }}
          placeholder={`선택지 ${i + 1}`}
          style={{
            height: 40,
            padding: '0 12px',
            border: `1px solid ${colors.border.default}`,
            borderRadius: radii.md,
            fontFamily: fonts.family.pretendard,
            fontSize: fonts.size.base,
          }}
        />
      ))}
      <button
        type="button"
        onClick={() => setOptions([...options, ''])}
        style={{
          background: 'transparent',
          border: `1px dashed ${colors.border.default}`,
          borderRadius: radii.md,
          padding: '8px',
          cursor: 'pointer',
          fontFamily: fonts.family.inter,
          fontSize: fonts.size.sm,
          color: colors.text.secondary,
        }}
      >
        + 선택지 추가
      </button>
      {error && (
        <div style={{ color: colors.state.danger, fontSize: fonts.size.sm, fontFamily: fonts.family.inter }}>
          {error}
        </div>
      )}
    </ModalShell>
  );
}

function CreateNoticeModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!title.trim()) return setError('제목 필수');
    if (!body.trim()) return setError('본문 필수');
    setSubmitting(true);
    try {
      await createNotice(title.trim(), body.trim(), eventDate || null);
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : '공지 생성 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="+ 공지 작성"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="게시"
      submitting={submitting}
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            void submit();
          }
        }}
        placeholder="공지 제목"
        maxLength={60}
        style={{
          height: 44,
          padding: '0 12px',
          border: `1px solid ${colors.border.default}`,
          borderRadius: radii.md,
          fontFamily: fonts.family.pretendard,
          fontSize: fonts.size.md,
        }}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            void submit();
          }
        }}
        placeholder="공지 내용"
        maxLength={2000}
        rows={5}
        style={{
          padding: 12,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radii.md,
          fontFamily: fonts.family.pretendard,
          fontSize: fonts.size.base,
          resize: 'vertical',
        }}
      />
      <div
        style={{
          fontFamily: fonts.family.inter,
          fontSize: fonts.size.xs,
          color: colors.text.muted,
          textAlign: 'right',
          marginTop: -4,
        }}
      >
        {body.length}/2000 · ⌘/Ctrl+Enter 로 게시
      </div>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: space[2],
          fontFamily: fonts.family.inter,
          fontSize: fonts.size.sm,
          color: colors.text.secondary,
        }}
      >
        <span style={{ minWidth: 70 }}>일정 날짜</span>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          style={{
            flex: 1,
            height: 40,
            padding: '0 12px',
            border: `1px solid ${colors.border.default}`,
            borderRadius: radii.md,
            fontFamily: fonts.family.pretendard,
            fontSize: fonts.size.base,
          }}
        />
        {eventDate && (
          <button
            type="button"
            onClick={() => setEventDate('')}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.text.muted,
              cursor: 'pointer',
              fontSize: fonts.size.xs,
              fontFamily: fonts.family.inter,
            }}
          >
            지우기
          </button>
        )}
      </label>
      <div
        style={{
          fontFamily: fonts.family.inter,
          fontSize: fonts.size.xs,
          color: colors.text.muted,
          marginTop: -4,
        }}
      >
        날짜를 지정하면 홈 화면 캘린더에 일정으로 표시됩니다.
      </div>
      {error && (
        <div style={{ color: colors.state.danger, fontSize: fonts.size.sm, fontFamily: fonts.family.inter }}>
          {error}
        </div>
      )}
    </ModalShell>
  );
}

const TABS = ['전체', '공지', '투표'] as const;
type Tab = (typeof TABS)[number];

export default function Classroom() {
  const { isStaff, isClassOfficer, userId } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('전체');
  const [showPollModal, setShowPollModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState<string | null>(null);
  const toast = useToast();

  const refresh = async () => {
    try {
      const [p, n] = await Promise.all([listPolls(), listNotices()]);
      setPolls(p);
      setNotices(n);
    } catch (e) {
      setError(e instanceof Error ? e.message : '데이터 로드 실패');
    }
  };

  useEffect(() => {
    void refresh();
    const onFocus = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, []);

  const activePoll = useMemo(
    () => polls.find((p) => !p.isClosed) ?? polls[0] ?? null,
    [polls],
  );

  const meetingNotice = useMemo(
    () =>
      notices.find((n) => n.title.toLowerCase().includes('회의')) ??
      notices[0] ??
      null,
    [notices],
  );

  const feedPolls = polls.map((p) => ({
    type: 'vote' as const,
    id: p.id,
    title: p.title,
    date: p.createdAt ?? '',
  }));
  const feedNotices = notices.map((n) => ({
    type: 'notice' as const,
    id: n.id,
    title: n.title,
    date: n.published_at,
  }));
  const combinedFeed = [...feedPolls, ...feedNotices].sort((a, b) =>
    (b.date || '').localeCompare(a.date || ''),
  );
  const filtered = combinedFeed.filter((f) =>
    activeTab === '전체'
      ? true
      : activeTab === '공지'
        ? f.type === 'notice'
        : f.type === 'vote',
  );

  const handleVote = async (pollId: string, optionId: string) => {
    setVoting(optionId);
    try {
      const updated = await votePoll(pollId, optionId);
      setPolls((prev) => prev.map((p) => (p.id === pollId ? updated : p)));
    } catch (e) {
      setError(e instanceof Error ? e.message : '투표 실패');
    } finally {
      setVoting(null);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!window.confirm('이 공지를 삭제할까요?')) return;
    try {
      await deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n.id !== id));
      toast.success('공지가 삭제되었습니다.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '삭제 실패');
    }
  };

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

      {(isStaff || isClassOfficer) && (
        <div
          style={{
            position: 'absolute',
            right: 80,
            top: 148,
            display: 'flex',
            gap: space[2],
          }}
        >
          <Button variant="secondary" size="sm" onClick={() => setShowNoticeModal(true)}>
            + 공지 작성
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowPollModal(true)}>
            + 투표 만들기
          </Button>
        </div>
      )}

      {error && (
        <div
          style={{
            position: 'absolute',
            left: 200,
            top: 210,
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
            {activePoll?.isClosed ? '마감된 투표' : '진행중인 투표'}
          </span>
        </div>
        {!activePoll ? (
          <div
            style={{
              padding: space[6],
              textAlign: 'center',
              color: colors.text.secondary,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
            }}
          >
            아직 진행중인 투표가 없어요.
          </div>
        ) : (
          <>
            <div
              style={{
                fontFamily: fonts.family.pretendard,
                fontSize: fonts.size.lg,
                fontWeight: fonts.weight.bold,
                color: colors.text.primary,
                lineHeight: 1.35,
              }}
            >
              {activePoll.title}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: space[2],
                marginTop: space[2],
              }}
            >
              {activePoll.options.map((opt) => {
                const voted = opt.voters.includes(userId ?? '');
                const percent =
                  activePoll.totalVoters > 0
                    ? Math.round(
                        ((opt.voteCount ?? 0) / Math.max(1, activePoll.totalVoters)) * 100,
                      )
                    : 0;
                return (
                  <button
                    key={opt.id}
                    disabled={activePoll.isClosed || voting === opt.id}
                    onClick={() => handleVote(activePoll.id, opt.id)}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: 48,
                      padding: `0 ${space[4]}px`,
                      background: voted ? colors.primarySoft : colors.surface.muted,
                      border: `2px solid ${voted ? colors.primary : 'transparent'}`,
                      borderRadius: radii.md,
                      cursor: activePoll.isClosed ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: space[3],
                      overflow: 'hidden',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${percent}%`,
                        background: voted
                          ? 'rgba(253,203,53,0.28)'
                          : 'rgba(0,0,0,0.05)',
                        transition: 'width 0.4s ease',
                      }}
                    />
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
                      {opt.content}
                    </span>
                    <span
                      style={{
                        position: 'relative',
                        fontFamily: fonts.family.inter,
                        fontSize: fonts.size.sm,
                        fontWeight: fonts.weight.bold,
                        color: voted ? colors.primaryDark : colors.text.secondary,
                      }}
                    >
                      {percent}%
                    </span>
                  </button>
                );
              })}
            </div>
            <div
              style={{
                marginTop: space[2],
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.xs,
                color: colors.text.secondary,
              }}
            >
              총 {activePoll.totalVoters}명 참여
            </div>
          </>
        )}
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
            최근 공지
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
          {meetingNotice ? meetingNotice.title : '등록된 공지가 없어요'}
        </div>
        {meetingNotice && (
          <div
            style={{
              marginTop: space[3],
              whiteSpace: 'pre-wrap',
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
              color: 'rgba(255,255,255,0.9)',
              maxHeight: 110,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {meetingNotice.content}
          </div>
        )}
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
          <div role="tablist" aria-label="학급 피드 탭" style={{ display: 'flex', gap: space[5], position: 'relative' }}>
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={active}
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
          <span
            style={{
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
              color: colors.text.secondary,
            }}
          >
            총 {filtered.length}건
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.length === 0 ? (
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
            filtered.map((post, i) => (
              <div
                key={`${post.type}-${post.id}`}
                onClick={() => {
                  if (post.type === 'notice') {
                    const full = notices.find((n) => n.id === post.id);
                    if (full) setSelectedNotice(full);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: space[3],
                  padding: `${space[3]}px 0`,
                  borderTop: i === 0 ? 'none' : `1px solid ${colors.border.default}`,
                  cursor: post.type === 'notice' ? 'pointer' : 'default',
                }}
              >
                <div
                  style={{
                    padding: '3px 10px',
                    borderRadius: radii.full,
                    background:
                      post.type === 'vote' ? colors.primarySoft : 'rgba(47,168,75,0.12)',
                    color:
                      post.type === 'vote' ? colors.primaryDark : colors.state.success,
                    fontFamily: fonts.family.inter,
                    fontSize: fonts.size.xs,
                    fontWeight: fonts.weight.bold,
                    flexShrink: 0,
                    width: 48,
                    textAlign: 'center',
                  }}
                >
                  {post.type === 'vote' ? '투표' : '공지'}
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
                  {post.date ? post.date.slice(0, 10).replace(/-/g, '.') : ''}
                </div>
                {isStaff && post.type === 'notice' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDeleteNotice(post.id);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: colors.state.danger,
                      fontSize: fonts.size.xs,
                      cursor: 'pointer',
                      fontFamily: fonts.family.inter,
                    }}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {showPollModal && (
        <CreatePollModal
          onClose={() => setShowPollModal(false)}
          onCreated={() => void refresh()}
        />
      )}
      {showNoticeModal && (
        <CreateNoticeModal
          onClose={() => setShowNoticeModal(false)}
          onCreated={() => void refresh()}
        />
      )}
      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </DashboardLayout>
  );
}
