import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button, Card } from '../../components/ui';
import { colors, fonts, radii, space } from '../../design/tokens';
import { useAuth } from '../../context/AuthContext';
import {
  createNotice,
  deleteNotice,
  listNotices,
  type Notice,
} from '../../api/notices';

export default function TeacherNotices() {
  const { isStaff } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    listNotices()
      .then(setNotices)
      .catch((e) =>
        setError(e instanceof Error ? e.message : '목록 로드 실패'),
      );
  };

  useEffect(() => {
    if (!isStaff) return;
    refresh();
    const onFocus = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [isStaff]);

  const MAX_TITLE = 60;
  const MAX_CONTENT = 2000;

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('제목·본문 필수');
      return;
    }
    if (title.length > MAX_TITLE) {
      setError(`제목은 ${MAX_TITLE}자 이내로 작성해주세요.`);
      return;
    }
    if (content.length > MAX_CONTENT) {
      setError(`본문은 ${MAX_CONTENT}자 이내로 작성해주세요.`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createNotice(title.trim(), content.trim());
      setTitle('');
      setContent('');
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '공지 생성 실패');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isStaff) {
    return (
      <DashboardLayout activePath="/manage/notices" sidebarTop={180} fillWidth>
        <div
          style={{
            position: 'absolute',
            left: 200,
            top: 200,
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size.xl,
            color: colors.state.danger,
          }}
        >
          교사/반장/부반장만 접근 가능합니다.
        </div>
      </DashboardLayout>
    );
  }

  const inputStyle: React.CSSProperties = {
    padding: 12,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radii.md,
    fontFamily: fonts.family.pretendard,
    fontSize: fonts.size.base,
    outline: 'none',
  };

  return (
    <DashboardLayout activePath="/manage/notices" sidebarTop={180} fillWidth>
      <div style={{ position: 'absolute', left: 200, top: 148 }}>
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.md,
            color: colors.primaryDark,
            fontWeight: fonts.weight.medium,
          }}
        >
          공지 관리
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
          공지사항
        </div>
      </div>

      <Card
        variant="surface"
        radius="xl"
        elevated
        style={{
          position: 'absolute',
          left: 200,
          top: 260,
          width: 540,
          padding: space[5],
          display: 'flex',
          flexDirection: 'column',
          gap: space[3],
        }}
      >
        <div
          style={{
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size.lg,
            fontWeight: fonts.weight.bold,
          }}
        >
          + 새 공지
        </div>
        <input
          placeholder="제목"
          value={title}
          maxLength={MAX_TITLE}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          style={{ ...inputStyle, height: 42, padding: '0 12px' }}
        />
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.xs,
            color: colors.text.muted,
            textAlign: 'right',
            marginTop: -6,
          }}
        >
          {title.length}/{MAX_TITLE}
        </div>
        <textarea
          placeholder="본문"
          rows={6}
          value={content}
          maxLength={MAX_CONTENT}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              void submit();
            }
          }}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.xs,
            color: colors.text.muted,
            textAlign: 'right',
            marginTop: -6,
          }}
        >
          {content.length}/{MAX_CONTENT} · ⌘/Ctrl+Enter 로 등록
        </div>
        {error && (
          <div
            style={{
              color: colors.state.danger,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
            }}
          >
            {error}
          </div>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={submit}
          disabled={submitting}
        >
          {submitting ? '게시 중…' : '게시'}
        </Button>
      </Card>

      <Card
        variant="surface"
        radius="xl"
        elevated
        style={{
          position: 'absolute',
          left: 760,
          top: 260,
          width: 580,
          padding: space[5],
          display: 'flex',
          flexDirection: 'column',
          gap: space[3],
          maxHeight: 640,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size.lg,
            fontWeight: fonts.weight.bold,
          }}
        >
          등록된 공지 ({notices.length})
        </div>
        {notices.length === 0 ? (
          <div
            style={{
              padding: space[5],
              textAlign: 'center',
              color: colors.text.secondary,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
            }}
          >
            아직 등록된 공지가 없습니다.
          </div>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              style={{
                border: `1px solid ${colors.border.default}`,
                borderRadius: radii.md,
                padding: space[3],
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.family.laundry,
                    fontSize: fonts.size.md,
                    fontWeight: fonts.weight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {n.title}
                </div>
                <button
                  onClick={async () => {
                    if (!window.confirm(`"${n.title}" 공지를 삭제할까요?`)) return;
                    await deleteNotice(n.id);
                    refresh();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: colors.state.danger,
                    cursor: 'pointer',
                    fontFamily: fonts.family.inter,
                    fontSize: fonts.size.xs,
                  }}
                >
                  삭제
                </button>
              </div>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: fonts.family.pretendard,
                  fontSize: fonts.size.sm,
                  color: colors.text.primary,
                }}
              >
                {n.content}
              </div>
              <div
                style={{
                  fontFamily: fonts.family.inter,
                  fontSize: fonts.size.xs,
                  color: colors.text.secondary,
                }}
              >
                {new Date(n.published_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </Card>
    </DashboardLayout>
  );
}
