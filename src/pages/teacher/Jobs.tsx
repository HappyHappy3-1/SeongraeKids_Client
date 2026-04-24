import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button, Card } from '../../components/ui';
import { colors, fonts, radii, space } from '../../design/tokens';
import { useAuth } from '../../context/AuthContext';
import {
  createRecruitmentPost,
  deleteRecruitmentPost,
  listRecruitmentPosts,
  type RecruitmentPost,
} from '../../api/recruitment';

const emptyForm = {
  company_name: '',
  headcount: 1,
  location: '',
  classroom_link: '',
  military_service_available: false,
  deadline: '',
  description: '',
};

export default function TeacherJobs() {
  const { isTeacher } = useAuth();
  const [posts, setPosts] = useState<RecruitmentPost[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    listRecruitmentPosts()
      .then(setPosts)
      .catch((e) =>
        setError(e instanceof Error ? e.message : '목록 로드 실패'),
      );
  };

  useEffect(() => {
    if (!isTeacher) return;
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
  }, [isTeacher]);

  const submit = async () => {
    if (!form.company_name.trim() || !form.location.trim()) {
      setError('회사명과 위치를 입력해주세요.');
      return;
    }
    if (form.deadline) {
      const d = new Date(form.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(d.getTime())) {
        setError('마감일 형식이 올바르지 않습니다.');
        return;
      }
      if (d.getTime() < today.getTime()) {
        setError('마감일은 오늘 이후로 설정해주세요.');
        return;
      }
    }
    setSubmitting(true);
    setError(null);
    try {
      await createRecruitmentPost({
        company_name: form.company_name.trim(),
        headcount: Number(form.headcount) || 1,
        location: form.location.trim(),
        classroom_link: form.classroom_link.trim() || null,
        military_service_available: form.military_service_available,
        deadline: form.deadline.trim() || null,
        description: form.description.trim() || null,
      });
      setForm({ ...emptyForm });
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '공고 등록 실패');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isTeacher) {
    return (
      <DashboardLayout activePath="/manage/jobs" sidebarTop={180} fillWidth>
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
          교사 계정만 접근 가능합니다.
        </div>
      </DashboardLayout>
    );
  }

  const inputStyle: React.CSSProperties = {
    height: 42,
    padding: '0 12px',
    border: `1px solid ${colors.border.default}`,
    borderRadius: radii.md,
    fontFamily: fonts.family.pretendard,
    fontSize: fonts.size.base,
    outline: 'none',
  };

  return (
    <DashboardLayout activePath="/manage/jobs" sidebarTop={180} fillWidth>
      <div style={{ position: 'absolute', left: 200, top: 148 }}>
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.md,
            color: colors.primaryDark,
            fontWeight: fonts.weight.medium,
          }}
        >
          교사 관리
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
          공고 관리
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
          + 새 공고 등록
        </div>
        <input
          placeholder="회사명"
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: space[2] }}>
          <input
            type="number"
            min={1}
            placeholder="채용 인원"
            value={form.headcount}
            onChange={(e) =>
              setForm({ ...form, headcount: Number(e.target.value) })
            }
            style={{ ...inputStyle, flex: 1 }}
          />
          <label
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
              color: colors.text.secondary,
            }}
          >
            <input
              type="checkbox"
              checked={form.military_service_available}
              onChange={(e) =>
                setForm({
                  ...form,
                  military_service_available: e.target.checked,
                })
              }
            />
            병역 가능
          </label>
        </div>
        <input
          placeholder="회사 위치"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="클래스룸 링크 (선택)"
          value={form.classroom_link}
          onChange={(e) =>
            setForm({ ...form, classroom_link: e.target.value })
          }
          style={inputStyle}
        />
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
          <span style={{ minWidth: 70 }}>마감일</span>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            style={{ ...inputStyle, flex: 1 }}
          />
          {form.deadline && (
            <button
              type="button"
              onClick={() => setForm({ ...form, deadline: '' })}
              style={{
                background: 'transparent',
                border: 'none',
                color: colors.text.muted,
                cursor: 'pointer',
                fontSize: fonts.size.xs,
              }}
            >
              지우기
            </button>
          )}
        </label>
        <textarea
          placeholder="세부 내용 (선택) — 지원요건/업종/연봉 등"
          value={form.description}
          rows={4}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{
            ...inputStyle,
            height: 'auto',
            padding: 10,
            resize: 'vertical',
            fontFamily: fonts.family.pretendard,
          }}
        />
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
          {submitting ? '등록 중…' : '공고 등록'}
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
          등록된 공고 ({posts.length})
        </div>
        {posts.length === 0 ? (
          <div
            style={{
              padding: space[5],
              textAlign: 'center',
              color: colors.text.secondary,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
            }}
          >
            아직 등록된 공고가 없습니다.
          </div>
        ) : (
          posts.map((p) => (
            <div
              key={p.id}
              style={{
                border: `1px solid ${colors.border.default}`,
                borderRadius: radii.md,
                padding: space[3],
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
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
                  {p.company_name}
                </div>
                <button
                  onClick={async () => {
                    if (!window.confirm(`"${p.company_name}" 공고를 삭제할까요?`)) return;
                    await deleteRecruitmentPost(p.id);
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
                  fontFamily: fonts.family.inter,
                  fontSize: fonts.size.sm,
                  color: colors.text.secondary,
                }}
              >
                {p.headcount}명 · {p.location}
                {p.military_service_available && ' · 병역 가능'}
                {p.deadline && ` · 마감 ${p.deadline}`}
              </div>
              {p.classroom_link && (
                <a
                  href={p.classroom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: fonts.size.xs,
                    color: colors.primaryDark,
                    wordBreak: 'break-all',
                  }}
                >
                  {p.classroom_link}
                </a>
              )}
            </div>
          ))
        )}
      </Card>
    </DashboardLayout>
  );
}
