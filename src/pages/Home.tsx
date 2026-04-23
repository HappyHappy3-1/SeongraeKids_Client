import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { COLORS, FONTS } from '../constants';
import { colors, fonts, radii, shadows, space, zIndex } from '../design/tokens';
import '../home.css';

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const JOB_CARDS_DATA = [
  {
    id: 1,
    dday: 'D-10',
    company: 'SK 삼성 하이닉스',
    headcount: '각 분야별 1명 소수 채용( 프론트/백엔드 )',
    requirements: 'Typescript, React, Spring Boot 등 Docker 기반 협업\n성래쌤 직접 기입 내용',
    location: '서울특별시 어디어디어이더 호암로 미림마이스터고\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/ODI1OTgyMDA1NjMw/a/ODU5Mzc2OTUwNTcy/details',
    military: true,
  },
  {
    id: 2,
    dday: 'D-3',
    company: '카카오 엔터프라이즈',
    headcount: '신입 개발자 2명 채용 ( 풀스택 )',
    requirements: 'React, Node.js, TypeScript 필수\n클라우드 경험 우대',
    location: '경기도 성남시 분당구 판교역로\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/example',
    military: false,
  },
  {
    id: 3,
    dday: 'D-7',
    company: 'NAVER Cloud',
    headcount: '백엔드 개발자 1명 채용',
    requirements: 'Java, Spring Boot, Kubernetes\nCI/CD 경험 우대',
    location: '경기도 성남시 분당구 정자일로\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/example2',
    military: true,
  },
  {
    id: 4,
    dday: 'D-14',
    company: '라인 플러스',
    headcount: '프론트엔드 개발자 1명',
    requirements: 'Vue.js 또는 React, TypeScript\n글로벌 서비스 경험 우대',
    location: '서울특별시 강남구 테헤란로\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/example3',
    military: false,
  },
];

const ANNOUNCEMENTS = [
  { id: 1, text: '이번주 CA 는 멘토링 입니다~ 성래쌤 직접 기입 내용~~', date: '2026.04.23' },
  { id: 2, text: '4월 현장학습 신청 마감 안내입니다. 성래쌤 직접 기입 내용~~', date: '2026.04.22' },
  { id: 3, text: '취업 의뢰 신규 등록 안내 - SK 삼성 하이닉스 외 3건', date: '2026.04.21' },
  { id: 4, text: '5월 포트폴리오 발표회 일정 공지입니다 성래쌤 직접 기입 내용~~', date: '2026.04.20' },
  { id: 5, text: '현장실습 확인서 제출 기한 안내 성래쌤 직접 기입 내용~~', date: '2026.04.19' },
];

const SCHEDULE_ITEMS = [
  { label: 'SK 삼성 하이닉스 마감', highlight: false },
  { label: 'SK 삼성 하이닉스 마감', highlight: false },
  { label: 'SK 삼성 하이닉스 마감', highlight: false },
  { label: 'SK 삼성 하이닉스 마감', highlight: false },
  { label: 'SK 삼성 하이닉스 마감', highlight: false },
  { label: 'SK 삼성 하이닉스 마감', highlight: true },
  { label: 'SK 삼성 하이닉스 마감', highlight: false },
];

const DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const DAY_LABELS_KO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

// ─── JobCard ──────────────────────────────────────────────────────────────────

type Job = (typeof JOB_CARDS_DATA)[0];

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
    { label: '지원 요건', content: card.requirements },
    { label: '회사 위치', content: card.location },
    { label: '클래스룸 링크', content: card.classroomLink },
  ];

  return (
    <div
      className="jobCard"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      style={{ width, background: COLORS.darkCard, fontFamily: FONTS.inter }}
    >
      <p className="jobCardDday">{card.dday}</p>
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
  const sections: { label: string; content: string; link?: boolean }[] = [
    { label: '채용 인원', content: job.headcount },
    { label: '지원 요건', content: job.requirements },
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
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const todayDow = today.getDay();

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - todayDow);
  const calendarNums = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.getDate();
  });

  const [slideIndex, setSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');
  const [selectedDay, setSelectedDay] = useState(todayDow);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const CARD_WIDTH = 249;
  const CARD_GAP = 12;
  const VISIBLE = 3;
  const maxSlide = JOB_CARDS_DATA.length - VISIBLE;

  const calendarStartX = 1059;
  const cellW = 33;

  return (
    <DashboardLayout activePath="/home" sidebarTop={180} fillWidth>

      {/* ── 취업 의뢰 공고 섹션 ── */}
      <div className="jobSection" />

      <button
        className={`tabBtn tabBtnActive`}
        onClick={() => setActiveTab('active')}
        style={{ color: activeTab === 'active' ? '#000' : '#aaa', fontFamily: FONTS.laundry }}
      >
        마감 임박 취업 의뢰 공고
      </button>
      <button
        className="tabBtn tabBtnClosed"
        onClick={() => setActiveTab('closed')}
        style={{ color: activeTab === 'closed' ? '#000' : '#aaa', fontFamily: FONTS.laundry }}
      >
        마감된 취업 의뢰 공고
      </button>

      <div
        className="tabUnderline"
        style={{
          left: activeTab === 'active' ? 275 : 546,
          width: activeTab === 'active' ? 174 : 130,
          background: COLORS.primary,
        }}
      />

      <div className="sliderWrap">
        <div
          className="sliderTrack"
          style={{ gap: CARD_GAP, transform: `translateX(-${slideIndex * (CARD_WIDTH + CARD_GAP)}px)` }}
        >
          {JOB_CARDS_DATA.map((card) => (
            <JobCard
              key={card.id}
              card={card}
              width={CARD_WIDTH}
              onClick={() => setSelectedJob(card)}
            />
          ))}
        </div>
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
        style={{ fontFamily: FONTS.laundry, color: '#aaa' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = COLORS.primary)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#aaa')}
      >
        더보기
      </button>

      {ANNOUNCEMENTS.map((ann, i) => {
        const y = 773 + i * 31;
        return (
          <div key={ann.id}>
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

      <div key={selectedDay} className="calendarHeader" style={{ fontFamily: FONTS.laundry }}>
        오늘, {DAY_LABELS_KO[selectedDay]}! 야르!
      </div>
      <div className="calendarSubDate" style={{ fontFamily: FONTS.inter, color: COLORS.subtleGray }}>
        {`${year}년 ${month}월 ${date}일`}
      </div>

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

      {SCHEDULE_ITEMS.map((item, i) => {
        const y = 365 + i * 36;
        return (
          <div key={i}>
            <div
              className="scheduleDot"
              style={{
                top: y + 8,
                background: item.highlight ? COLORS.primary : COLORS.dotGray,
                border: `1px solid ${COLORS.dotGray}`,
              }}
            />
            {i < SCHEDULE_ITEMS.length - 1 && (
              <div className="scheduleLine" style={{ top: y + 16, background: COLORS.dotGray }} />
            )}
            <div
              className="scheduleLabel"
              style={{
                top: y,
                fontFamily: FONTS.pretendard,
                color: item.highlight ? COLORS.primary : COLORS.scheduleGray,
              }}
              onMouseEnter={(e) => {
                if (!item.highlight) (e.currentTarget as HTMLElement).style.color = COLORS.primary;
              }}
              onMouseLeave={(e) => {
                if (!item.highlight) (e.currentTarget as HTMLElement).style.color = COLORS.scheduleGray;
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}

      {/* ── 급식 섹션 (빈 칸) ── */}
      <div className="mealSection" />

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </DashboardLayout>
  );
}