import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import PortfolioThumbnail from '../../components/PortfolioThumbnail';
import FeedbackThread from '../../components/FeedbackThread';
import { Button, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { listStudents } from '../../api/profiles';
import type { ProfileData } from '../../context/AuthContext';
import {
  getAllPortfolios,
  getCachedSignedUrl,
  type PortfolioItem,
} from '../../api/portfolio';
import { ROLE_LABELS } from '../../constants';
import { colors, fonts, radii, space } from '../../design/tokens';

const PdfSlideViewer = lazy(
  () => import('../../components/PdfSlideViewer'),
);

export default function Manage() {
  const { isTeacher, name: myName } = useAuth();
  const [students, setStudents] = useState<ProfileData[]>([]);
  const [studentQuery, setStudentQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<ProfileData | null>(null);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<PortfolioItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    if (!isTeacher) return;
    const reload = async () => {
      try {
        const [studentList, allPortfolios] = await Promise.all([
          listStudents(),
          getAllPortfolios(),
        ]);
        setStudents(studentList);
        setPortfolios(allPortfolios);
      } catch (e) {
        setError(e instanceof Error ? e.message : '데이터 로드 실패');
      }
    };
    void reload();
    const onFocus = () => {
      if (document.visibilityState === 'visible') void reload();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [isTeacher]);

  useEffect(() => {
    setSelectedPortfolio(null);
  }, [selectedStudent?.id]);

  const filteredStudents = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.school_email.toLowerCase().includes(q),
    );
  }, [students, studentQuery]);

  const studentPortfolios = useMemo(() => {
    if (!selectedStudent) return [];
    return portfolios.filter((p) => p.studentId === selectedStudent.id);
  }, [portfolios, selectedStudent]);

  const openPreview = async (p: PortfolioItem) => {
    try {
      const url = await getCachedSignedUrl(p.id);
      setPreviewUrl(url);
      setPreviewTitle(p.originalName);
    } catch (e) {
      setError(e instanceof Error ? e.message : '미리보기 링크 실패');
    }
  };

  if (!isTeacher) {
    return (
      <DashboardLayout activePath="/manage" sidebarTop={180} fillWidth>
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
          교사 계정만 접근 가능한 페이지입니다.
        </div>
      </DashboardLayout>
    );
  }

  const LEFT_X = 150;
  const LEFT_W = 280;
  const CENTER_X = LEFT_X + LEFT_W + 20;
  const CENTER_W = 620;
  const RIGHT_X = CENTER_X + CENTER_W + 20;
  const RIGHT_W = 300;
  const TOP = 280;
  const PANE_HEIGHT = 680;

  return (
    <DashboardLayout activePath="/manage" sidebarTop={180} fillWidth>
      <div style={{ position: 'absolute', left: LEFT_X, top: 148 }}>
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.md,
            color: colors.primaryDark,
            fontWeight: fonts.weight.medium,
          }}
        >
          {myName ? `${myName}선생님 하이~` : '교사 대시보드'}
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
          학생 관리
        </div>
        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.sm,
            color: colors.text.secondary,
            marginTop: 4,
          }}
        >
          학생을 선택해 포트폴리오를 보고 피드백을 남겨주세요.
        </div>
      </div>

      {error && (
        <div
          style={{
            position: 'absolute',
            left: LEFT_X,
            top: 248,
            width: CENTER_X + CENTER_W + RIGHT_W - LEFT_X,
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
          left: LEFT_X,
          top: TOP,
          width: LEFT_W,
          height: PANE_HEIGHT,
          padding: space[4],
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
            color: colors.text.primary,
          }}
        >
          학생 ({filteredStudents.length})
        </div>
        <div style={{ position: 'relative' }}>
          <input
            value={studentQuery}
            onChange={(e) => setStudentQuery(e.target.value)}
            placeholder="이름/이메일 검색"
            style={{
              width: '100%',
              height: 38,
              padding: '0 36px 0 12px',
              boxSizing: 'border-box',
              border: `1px solid ${colors.border.default}`,
              borderRadius: radii.md,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
              outline: 'none',
            }}
          />
          {studentQuery && (
            <button
              onClick={() => setStudentQuery('')}
              aria-label="검색어 지우기"
              style={{
                position: 'absolute',
                right: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 24,
                height: 24,
                border: 'none',
                borderRadius: radii.full,
                background: 'rgba(0,0,0,0.06)',
                color: colors.text.secondary,
                cursor: 'pointer',
                fontSize: 14,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filteredStudents.map((s) => {
            const active = selectedStudent?.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                style={{
                  textAlign: 'left',
                  background: active ? colors.primarySoft : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${active ? colors.primary : 'transparent'}`,
                  padding: `${space[2]}px ${space[3]}px`,
                  borderRadius: radii.md,
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      'rgba(253,203,53,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      'transparent';
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.family.pretendard,
                    fontSize: fonts.size.base,
                    fontWeight: fonts.weight.semibold,
                    color: colors.text.primary,
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontFamily: fonts.family.inter,
                    fontSize: fonts.size.xs,
                    color: colors.text.secondary,
                    marginTop: 2,
                    display: 'flex',
                    gap: 6,
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      padding: '1px 6px',
                      borderRadius: radii.full,
                      background: colors.primarySoft,
                      color: colors.primaryDark,
                      fontWeight: fonts.weight.bold,
                      fontSize: fonts.size.xs,
                    }}
                  >
                    {ROLE_LABELS[s.role] ?? s.role}
                  </span>
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.school_email}
                  </span>
                </div>
              </button>
            );
          })}
          {filteredStudents.length === 0 && (
            <div
              style={{
                padding: space[4],
                textAlign: 'center',
                color: colors.text.secondary,
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.sm,
              }}
            >
              {studentQuery
                ? `"${studentQuery}"에 해당하는 학생이 없습니다.`
                : '학생이 없습니다.'}
            </div>
          )}
        </div>
      </Card>

      <Card
        variant="surface"
        radius="xl"
        elevated
        style={{
          position: 'absolute',
          left: CENTER_X,
          top: TOP,
          width: CENTER_W,
          height: PANE_HEIGHT,
          padding: space[4],
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
            color: colors.text.primary,
          }}
        >
          {selectedStudent
            ? `${selectedStudent.name}님의 포트폴리오 (${studentPortfolios.length})`
            : '포트폴리오'}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {!selectedStudent ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.text.secondary,
                fontFamily: fonts.family.inter,
              }}
            >
              왼쪽에서 학생을 선택하세요.
            </div>
          ) : studentPortfolios.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.text.secondary,
                fontFamily: fonts.family.inter,
              }}
            >
              이 학생은 아직 포트폴리오를 업로드하지 않았습니다.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: space[3],
              }}
            >
              {studentPortfolios.map((p) => {
                const active = selectedPortfolio?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPortfolio(p)}
                    style={{
                      border: `2px solid ${active ? colors.primary : 'transparent'}`,
                      borderRadius: radii.lg,
                      padding: space[2],
                      cursor: 'pointer',
                      background: active ? colors.primarySoft : 'transparent',
                      transition: 'background 0.12s, border-color 0.12s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: space[2],
                    }}
                  >
                    <PortfolioThumbnail
                      portfolioId={p.id}
                      resolveUrl={() => getCachedSignedUrl(p.id)}
                    />
                    <div
                      style={{
                        fontFamily: fonts.family.pretendard,
                        fontSize: fonts.size.sm,
                        fontWeight: fonts.weight.semibold,
                        color: colors.text.primary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={p.originalName}
                    >
                      {p.originalName}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        void openPreview(p);
                      }}
                      style={{ height: 32, fontSize: fonts.size.xs }}
                    >
                      슬라이드 보기
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <Card
        variant="surface"
        radius="xl"
        elevated
        style={{
          position: 'absolute',
          left: RIGHT_X,
          top: TOP,
          width: RIGHT_W,
          height: PANE_HEIGHT,
          padding: space[4],
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
            color: colors.text.primary,
          }}
        >
          피드백
        </div>
        {!selectedPortfolio ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.text.secondary,
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.sm,
              textAlign: 'center',
            }}
          >
            포트폴리오를 선택하면 댓글을 작성할 수 있어요.
          </div>
        ) : (
          <>
            <div
              style={{
                fontFamily: fonts.family.inter,
                fontSize: fonts.size.xs,
                color: colors.text.secondary,
                wordBreak: 'break-all',
              }}
            >
              {selectedPortfolio.originalName}
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <FeedbackThread
                portfolioId={selectedPortfolio.id}
                canWrite
                compact
              />
            </div>
          </>
        )}
      </Card>

      {previewUrl && (
        <Suspense fallback={null}>
          <PdfSlideViewer
            url={previewUrl}
            title={previewTitle}
            onClose={() => setPreviewUrl(null)}
          />
        </Suspense>
      )}

    </DashboardLayout>
  );
}
