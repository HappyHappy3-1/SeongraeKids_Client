import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { COLORS, FONTS } from '../constants';
import { colors, fonts, radii, shadows, space, zIndex } from '../design/tokens';
import { listRecruitmentPosts, type RecruitmentPost } from '../api/recruitment';
import { listNotices, type Notice } from '../api/notices';
import SchoolTabs from '../components/SchoolTabs';
import NoticeDetailModal from '../components/NoticeDetailModal';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';
import '../home.css';

interface Job {
  id: string;
  dday: string;
  company: string;
  headcount: string;
  requirements: string;
  location: string;
  classroomLink: string;
  military: boolean;
  deadline: string | null;
}

function summarize(s: string, n = 40): string {
  const flat = s.replace(/\s+/g, ' ').trim();
  return flat.length > n ? flat.slice(0, n).trim() + '…' : flat;
}

function computeDday(deadline: string | null): string {
  if (!deadline) return '모집중';
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return '모집중';
  const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return '마감';
  if (diff === 0) return 'D-DAY';
  return `D-${diff}`;
}

function toJob(post: RecruitmentPost): Job {
  return {
    id: post.id,
    dday: computeDday(post.deadline),
    company: post.company_name,
    headcount: `${post.headcount}명 채용`,
    requirements: post.description ?? '세부 내용은 클래스룸 링크 참조',
    location: post.location,
    classroomLink: post.classroom_link ?? '',
    military: post.military_service_available,
    deadline: post.deadline,
  };
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const DAY_LABELS_KO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

// ─── JobCard ──────────────────────────────────────────────────────────────────

function JobCard({
  card,
  width,
  onClick,
}: {
  card: Job;
  width: number;
  onClick: () => void;
}) {
  const sections = [
    { label: '채용 인원', content: card.headcount },
    { label: '지원 요건', content: summarize(card.requirements, 38) },
    { label: '회사 위치', content: card.location },
    { label: '클래스룸 링크', content: card.classroomLink },
  ];

  const urgent = card.dday === 'D-DAY' || card.dday === 'D-1' || card.dday === 'D-2';
  const ddayColor = card.dday === '마감'
    ? 'rgba(255,255,255,0.45)'
    : urgent
      ? '#FF6B4A'
      : COLORS.primary;

  return (
    <div
      className="jobCard"
      role="button"
      tabIndex={0}
      aria-label={`${card.company} 공고, ${card.dday}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{ width, background: COLORS.darkCard, fontFamily: FONTS.inter }}
    >
      <p className="jobCardDday" style={{ color: ddayColor, fontWeight: urgent ? 800 : 600 }}>
        {card.dday}
      </p>
      <p className="jobCardLabel">회사명</p>
      <p className="jobCardCompany" style={{ color: COLORS.primary, fontFamily: FONTS.laundry }}>
        {card.company}
      </p>
      <div className="jobCardDivider" />
      {sections.map(({ label, content }) => (
        <div key={label} className="jobCardSection">
          <p className="jobCardSectionLabel">{label}</p>
          <p className={`jobCardSectionContent ${label === '클래스룸 링크' ? 'jobCardSectionContentBreak' : ''}`}>
            {content}
          </p>
        </div>
      ))}
      {card.military && (
        <p className="jobCardMilitary" style={{ color: COLORS.primary }}>
          병역 가능
        </p>
      )}
    </div>
  );
}

function JobDetailModal({ job, onClose }: { job: Job; onClose: () => void }) {
  useEscapeKey(onClose);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef);
  const [showDetail, setShowDetail] = useState(false);
  const sections: { label: string; content: string; link?: boolean }[] = [
    { label: '채용 인원', content: job.headcount },
    { label: '회사 위치', content: job.location },
    { label: '클래스룸 링크', content: job.classroomLink, link: true },
  ];

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
        aria-label={`${job.company} 공고 상세`}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, 100%)',
          maxHeight: '86vh',
          background: colors.surface.dark,
          borderRadius: radii.xl,
          boxShadow: shadows.float,
          overflowY: 'auto',
          padding: `${space[8]}px ${space[8]}px ${space[6]}px`,
          position: 'relative',
          color: colors.white,
          fontFamily: fonts.family.pretendard,
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)')
          }
        >
          ×
        </button>

        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.lg,
            fontWeight: fonts.weight.bold,
            color: colors.white,
            letterSpacing: '0.5px',
            marginBottom: space[5],
          }}
        >
          {job.dday}
        </div>

        <div
          style={{
            fontFamily: fonts.family.inter,
            fontSize: fonts.size.sm,
            color: 'rgba(255,255,255,0.72)',
            fontWeight: fonts.weight.medium,
            marginBottom: 2,
          }}
        >
          회사명
        </div>
        <div
          style={{
            fontFamily: fonts.family.laundry,
            fontSize: fonts.size['3xl'],
            fontWeight: fonts.weight.bold,
            color: colors.primary,
            lineHeight: 1.12,
            marginBottom: space[5],
          }}
        >
          {job.company}
        </div>

        <div
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.22)',
            margin: `0 0 ${space[5]}px`,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: space[5] }}>
          {sections.map(({ label, content, link }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: fonts.family.inter,
                  fontSize: fonts.size.base,
                  fontWeight: fonts.weight.bold,
                  color: colors.white,
                  marginBottom: 6,
                }}
              >
                {label}
              </div>
              {link ? (
                <a
                  href={content}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: fonts.family.inter,
                    fontSize: fonts.size.base,
                    color: 'rgba(255,255,255,0.78)',
                    wordBreak: 'break-all',
                    textDecoration: 'none',
                    lineHeight: 1.5,
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.textDecoration = 'underline')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.textDecoration = 'none')
                  }
                >
                  {content}
                </a>
              ) : (
                <div
                  style={{
                    fontFamily: fonts.family.inter,
                    fontSize: fonts.size.base,
                    color: 'rgba(255,255,255,0.78)',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.55,
                  }}
                >
                  {content}
                </div>
              )}
            </div>
          ))}
        </div>

        {job.requirements && (
          <div style={{ marginTop: space[5] }}>
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
                {job.requirements}
              </div>
            )}
          </div>
        )}

        {job.military && (
          <div
            style={{
              marginTop: space[6],
              fontFamily: fonts.family.inter,
              fontSize: fonts.size.base,
              fontWeight: fonts.weight.bold,
              color: colors.primary,
            }}
          >
            병역 가능
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ArrowButton ──────────────────────────────────────────────────────────────

function ArrowButton({
  direction,
  side,
  onClick,
}: {
  direction: 'left' | 'right';
  side: 'left' | 'right';
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`arrowBtn ${side === 'left' ? 'arrowBtnLeft' : 'arrowBtnRight'}`}
    >
      <svg width="6" height="15" viewBox="0 0 6 15" fill="none">
        {direction === 'right' ? (
          <path d="M1 1L5 7.5L1 14" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M5 1L1 7.5L5 14" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayDow = today.getDay();

  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = useMemo(() => {
    const d = new Date(today);
    d.setDate(today.getDate() - todayDow + weekOffset * 7);
    return d;
  }, [today, todayDow, weekOffset]);

  const calendarNums = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.getDate();
  });

  const [slideIndex, setSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');
  const [selectedDay, setSelectedDay] = useState(todayDow);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const reload = () => {
      listRecruitmentPosts()
        .then((posts) => setJobs(posts.map(toJob)))
        .catch(() => setJobs([]));
      listNotices()
        .then(setNotices)
        .catch(() => setNotices([]));
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

  const announcements = useMemo(
    () =>
      notices.slice(0, 5).map((n) => ({
        id: n.id,
        text: n.title,
        date: (n.published_at ?? '').slice(0, 10).replace(/-/g, '.'),
      })),
    [notices],
  );

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const isClosed = (j: Job) => {
    if (j.dday === '마감') return true;
    return false;
  };
  const activeJobs = jobs.filter((j) => !isClosed(j));
  const closedJobs = jobs.filter(isClosed);
  const visibleJobs = activeTab === 'active' ? activeJobs : closedJobs;

  const CARD_WIDTH = 249;
  const CARD_GAP = 12;
  const VISIBLE = 3;
  const maxSlide = Math.max(0, visibleJobs.length - VISIBLE);

  const calendarStartX = 1059;
  const cellW = 33;

  const selectedDate = useMemo(() => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + selectedDay);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [weekStart, selectedDay]);

  const isToday = selectedDate.getTime() === today.getTime();
  const selYear = selectedDate.getFullYear();
  const selMonth = selectedDate.getMonth() + 1;
  const selDate = selectedDate.getDate();

  const scheduleItems = useMemo(() => {
    const sameDay = (iso: string) => {
      const d = new Date(iso);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === selectedDate.getTime();
    };
    const items: {
      id: string;
      label: string;
      kind: 'job' | 'notice';
      onClick: () => void;
    }[] = [];
    for (const j of jobs) {
      if (!j.deadline || !sameDay(j.deadline)) continue;
      items.push({
        id: `job-${j.id}`,
        label: `${j.company} 마감`,
        kind: 'job',
        onClick: () => setSelectedJob(j),
      });
    }
    for (const n of notices) {
      if (!n.event_date || !sameDay(n.event_date)) continue;
      items.push({
        id: `notice-${n.id}`,
        label: n.title,
        kind: 'notice',
        onClick: () => setSelectedNotice(n),
      });
    }
    return items;
  }, [jobs, notices, selectedDate]);

  return (
    <DashboardLayout activePath="/home" sidebarTop={180} fillWidth>

      {/* ── 취업 의뢰 공고 섹션 ── */}
      <div className="jobSection" />

      <div role="tablist" aria-label="취업 공고 탭" style={{ display: 'contents' }}>
        <button
          role="tab"
          aria-selected={activeTab === 'active'}
          className={`tabBtn tabBtnActive`}
          onClick={() => setActiveTab('active')}
          style={{ color: activeTab === 'active' ? '#000' : '#aaa', fontFamily: FONTS.laundry }}
        >
          마감 임박 취업 의뢰 공고
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'closed'}
          className="tabBtn tabBtnClosed"
          onClick={() => setActiveTab('closed')}
          style={{ color: activeTab === 'closed' ? '#000' : '#aaa', fontFamily: FONTS.laundry }}
        >
          마감된 취업 의뢰 공고
        </button>
      </div>

      <div
        className="tabUnderline"
        style={{
          left: activeTab === 'active' ? 275 : 546,
          width: activeTab === 'active' ? 174 : 130,
          background: COLORS.primary,
        }}
      />

      <div className="sliderWrap">
        {visibleJobs.length === 0 ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa',
              fontFamily: FONTS.inter,
              fontSize: 14,
              textAlign: 'center',
              padding: 24,
            }}
          >
            {activeTab === 'active'
              ? '마감 임박 공고가 없습니다.'
              : '마감된 공고가 없습니다.'}
          </div>
        ) : (
          <div
            className="sliderTrack"
            style={{
              gap: CARD_GAP,
              transform: `translateX(-${slideIndex * (CARD_WIDTH + CARD_GAP)}px)`,
            }}
          >
            {visibleJobs.map((card) => (
              <JobCard
                key={card.id}
                card={card}
                width={CARD_WIDTH}
                onClick={() => setSelectedJob(card)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="dotsWrap">
        {Array.from({ length: maxSlide + 1 }).map((_, i) => (
          <button
            key={i}
            className="dot"
            onClick={() => setSlideIndex(i)}
            style={{
              width: i === slideIndex ? 18 : 6,
              background: i === slideIndex ? COLORS.primary : '#ccc',
            }}
          />
        ))}
      </div>

      {slideIndex > 0 && (
        <ArrowButton direction="left" side="left" onClick={() => setSlideIndex((p) => Math.max(0, p - 1))} />
      )}
      {slideIndex < maxSlide && (
        <ArrowButton direction="right" side="right" onClick={() => setSlideIndex((p) => Math.min(maxSlide, p + 1))} />
      )}

      {/* ── 공지사항 섹션 ── */}
      <div className="noticeSection" />
      <div className="noticeTitle" style={{ fontFamily: FONTS.laundry }}>공지사항</div>
      <div className="noticeUnderlineThick" style={{ background: COLORS.primary }} />
      <div className="noticeUnderlineThin" style={{ background: COLORS.primary }} />
      <button
        className="noticeMoreBtn"
        onClick={() => navigate('/classroom')}
        style={{ fontFamily: FONTS.laundry, color: '#aaa', cursor: 'pointer' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = COLORS.primary)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#aaa')}
      >
        더보기
      </button>

      {announcements.length === 0 && (
        <div
          style={{
            position: 'absolute',
            left: 262,
            top: 800,
            width: 720,
            color: '#aaa',
            fontFamily: FONTS.inter,
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          아직 등록된 공지가 없습니다.
        </div>
      )}

      {announcements.map((ann, i) => {
        const y = 773 + i * 31;
        const full = notices.find((n) => n.id === ann.id) ?? null;
        return (
          <div
            key={ann.id}
            onClick={() => full && setSelectedNotice(full)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && full) {
                e.preventDefault();
                setSelectedNotice(full);
              }
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = 'rgba(253,203,53,0.08)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = 'transparent')
            }
            style={{
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <div className="noticeRow" style={{ top: y, fontFamily: FONTS.inter }}>
              {ann.text}
            </div>
            <div className="noticeDate" style={{ top: y, fontFamily: FONTS.inter, color: COLORS.subtleGray }}>
              {ann.date}
            </div>
          </div>
        );
      })}

      {/* ── 달력 / 일정 섹션 ── */}
      <div className="calendarSection" />

      <div key={`${weekOffset}-${selectedDay}`} className="calendarHeader" style={{ fontFamily: FONTS.laundry }}>
        {isToday
          ? `오늘, ${DAY_LABELS_KO[selectedDay]}! 야르!`
          : `${DAY_LABELS_KO[selectedDay]}! 야르!`}
      </div>
      <div className="calendarSubDate" style={{ fontFamily: FONTS.inter, color: COLORS.subtleGray }}>
        {`${selYear}년 ${selMonth}월 ${selDate}일`}
      </div>

      <button
        aria-label="이전 주"
        onClick={() => setWeekOffset((v) => v - 1)}
        style={{
          position: 'absolute',
          left: 1338,
          top: 215,
          width: 26,
          height: 26,
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0,0,0,0.04)',
          color: COLORS.subtleGray,
          cursor: 'pointer',
          fontFamily: FONTS.inter,
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = COLORS.primary;
          (e.currentTarget as HTMLElement).style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)';
          (e.currentTarget as HTMLElement).style.color = COLORS.subtleGray;
        }}
      >
        ‹
      </button>
      <button
        aria-label="다음 주"
        onClick={() => setWeekOffset((v) => v + 1)}
        style={{
          position: 'absolute',
          left: 1370,
          top: 215,
          width: 26,
          height: 26,
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(0,0,0,0.04)',
          color: COLORS.subtleGray,
          cursor: 'pointer',
          fontFamily: FONTS.inter,
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = COLORS.primary;
          (e.currentTarget as HTMLElement).style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)';
          (e.currentTarget as HTMLElement).style.color = COLORS.subtleGray;
        }}
      >
        ›
      </button>
      {weekOffset !== 0 && (
        <button
          onClick={() => setWeekOffset(0)}
          style={{
            position: 'absolute',
            left: 1300,
            top: 237,
            padding: '2px 8px',
            borderRadius: 10,
            border: `1px solid ${COLORS.primary}`,
            background: 'transparent',
            color: COLORS.primary,
            cursor: 'pointer',
            fontFamily: FONTS.inter,
            fontSize: 10,
            fontWeight: 600,
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
          }}
        >
          이번 주로
        </button>
      )}

      {DAYS.map((d, i) => (
        <div
          key={d}
          className="calendarDayLabel"
          style={{ left: calendarStartX + i * cellW, fontFamily: FONTS.inter }}
        >
          {d}
        </div>
      ))}

      {calendarNums.map((d, i) => {
        const isSelected = i === selectedDay;
        return (
          <button
            key={`n${d}`}
            className={`calendarDayNum ${isSelected ? 'calendarDayNumSelected' : ''}`}
            onClick={() => setSelectedDay(i)}
            style={{ left: calendarStartX + i * cellW, fontFamily: FONTS.inter }}
            onMouseEnter={(e) => {
              if (!isSelected) (e.currentTarget as HTMLElement).style.transform = 'scale(1.18)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            {isSelected && (
              <div className="calendarSelectedCircle" style={{ background: COLORS.primary }} />
            )}
            {d}
          </button>
        );
      })}

      <div className="calendarDivider" style={{ background: COLORS.primary }} />

      {scheduleItems.length === 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 1059,
            top: 365,
            width: 340,
            color: '#aaa',
            fontFamily: FONTS.inter,
            fontSize: 13,
          }}
        >
          이 날에 등록된 일정이 없어요.
        </div>
      ) : (
        scheduleItems.map((item, i) => {
          const y = 365 + i * 36;
          const accent = item.kind === 'job' ? COLORS.primary : '#4CAF50';
          return (
            <div key={item.id} onClick={item.onClick} style={{ cursor: 'pointer' }}>
              <div
                className="scheduleDot"
                style={{
                  top: y + 8,
                  background: accent,
                  border: `1px solid ${accent}`,
                }}
              />
              {i < scheduleItems.length - 1 && (
                <div className="scheduleLine" style={{ top: y + 16, background: COLORS.dotGray }} />
              )}
              <div
                className="scheduleLabel"
                style={{
                  top: y,
                  fontFamily: FONTS.pretendard,
                  color: accent,
                  fontWeight: 700,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })
      )}

      {/* ── 급식 + 시간표 탭 ── */}
      <SchoolTabs
        grade="3"
        classNm="1"
        style={{
          position: 'absolute',
          left: 1034,
          top: 657,
          width: 370,
          minHeight: 280,
        }}
      />

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
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