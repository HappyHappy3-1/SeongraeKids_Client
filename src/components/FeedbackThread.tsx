import { useEffect, useState } from 'react';
import {
  addFeedback,
  deleteFeedback,
  listFeedback,
  type FeedbackItem,
} from '../api/feedback';
import { Button } from './ui';
import { colors, fonts, radii, space } from '../design/tokens';
import { useAuth } from '../context/AuthContext';

function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Math.floor((Date.now() - t) / 1000);
  if (diff < 60) return `방금 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function initialOf(id: string): string {
  return (id.slice(0, 1) || 'T').toUpperCase();
}

function Avatar({ id }: { id: string }) {
  const palette = [
    colors.primary,
    colors.primaryDark,
    '#4F9DFD',
    '#6FBF73',
    '#E8769E',
  ];
  const idx = id
    .split('')
    .reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: radii.full,
        background: palette[idx],
        color: colors.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts.family.inter,
        fontSize: fonts.size.sm,
        fontWeight: fonts.weight.bold,
        flexShrink: 0,
      }}
    >
      {initialOf(id)}
    </div>
  );
}

interface Props {
  portfolioId: string;
  canWrite?: boolean;
  compact?: boolean;
}

export default function FeedbackThread({
  portfolioId,
  canWrite = false,
  compact = false,
}: Props) {
  const { userId, isTeacher } = useAuth();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    listFeedback(portfolioId)
      .then(setItems)
      .catch((e) =>
        setError(e instanceof Error ? e.message : '피드백 로드 실패'),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioId]);

  const submit = async () => {
    if (!draft.trim()) return;
    try {
      const created = await addFeedback(portfolioId, draft);
      setItems((prev) => [created, ...prev]);
      setDraft('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '피드백 저장 실패');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('이 댓글을 삭제할까요?')) return;
    try {
      await deleteFeedback(portfolioId, id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : '삭제 실패');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space[3],
      }}
    >
      {canWrite && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="피드백을 댓글로 남겨주세요…"
            maxLength={1000}
            rows={compact ? 2 : 3}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                void submit();
              }
            }}
            style={{
              padding: space[2],
              border: `1px solid ${colors.border.default}`,
              borderRadius: radii.md,
              fontFamily: fonts.family.pretendard,
              fontSize: fonts.size.sm,
              resize: 'vertical',
              outline: 'none',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: space[2],
            }}
          >
            <span
              style={{
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.xs,
                color: colors.text.muted,
              }}
            >
              {draft.length}/1000 · ⌘/Ctrl+Enter 로 등록
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={submit}
              disabled={!draft.trim()}
              style={{ height: 34, fontSize: fonts.size.sm }}
            >
              댓글 등록
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
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

      {loading && items.length === 0 ? (
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.sm,
            color: colors.text.secondary,
            padding: space[3],
            textAlign: 'center',
          }}
        >
          불러오는 중…
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.sm,
            color: colors.text.secondary,
            padding: space[3],
            textAlign: 'center',
          }}
        >
          아직 댓글이 없어요.
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: space[3],
          }}
        >
          {items.map((f) => {
            const mine = isTeacher && f.teacher_id === userId;
            return (
              <div
                key={f.id}
                style={{
                  display: 'flex',
                  gap: space[2],
                  alignItems: 'flex-start',
                }}
              >
                <Avatar id={f.teacher_id} />
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: fonts.family.pretendard,
                        fontSize: fonts.size.sm,
                        fontWeight: fonts.weight.bold,
                        color: colors.text.primary,
                      }}
                    >
                      선생님
                    </span>
                    <span
                      style={{
                        fontFamily: fonts.family.inter,
                        fontSize: fonts.size.xs,
                        color: colors.text.secondary,
                      }}
                    >
                      · {relativeTime(f.created_at)}
                    </span>
                  </div>
                  <div
                    style={{
                      background: colors.surface.muted,
                      borderRadius: `${radii.sm}px ${radii.md}px ${radii.md}px ${radii.md}px`,
                      padding: `${space[2]}px ${space[3]}px`,
                      fontFamily: fonts.family.pretendard,
                      fontSize: fonts.size.sm,
                      color: colors.text.primary,
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5,
                    }}
                  >
                    {f.feedback_text}
                  </div>
                  {mine && (
                    <button
                      onClick={() => handleDelete(f.id)}
                      style={{
                        alignSelf: 'flex-start',
                        background: 'transparent',
                        border: 'none',
                        color: colors.state.danger,
                        cursor: 'pointer',
                        fontFamily: fonts.family.inter,
                        fontSize: fonts.size.xs,
                        padding: 0,
                      }}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
