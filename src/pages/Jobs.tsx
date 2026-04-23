import DashboardLayout from '../components/DashboardLayout';
import { COLORS, FONTS } from '../constants';
import '../job.css';

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const ACTIVE_CARDS = [
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
    company: 'SK 삼성 하이닉스',
    headcount: '각 분야별 1명 소수 채용( 프론트/백엔드 )',
    requirements: 'Typescript, React, Spring Boot 등 Docker 기반 협업\n성래쌤 직접 기입 내용',
    location: '서울특별시 어디어디어이더 호암로 미림마이스터고\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/ODI1OTgyMDA1NjMw/a/ODU5Mzc2OTUwNTcy/details',
    military: false,
  },
  {
    id: 3,
    dday: 'D-7',
    company: 'SK 삼성 하이닉스',
    headcount: '각 분야별 1명 소수 채용( 프론트/백엔드 )',
    requirements: 'Typescript, React, Spring Boot 등 Docker 기반 협업\n성래쌤 직접 기입 내용',
    location: '서울특별시 어디어디어이더 호암로 미림마이스터고\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/ODI1OTgyMDA1NjMw/a/ODU5Mzc2OTUwNTcy/details',
    military: true,
  },
  {
    id: 4,
    dday: 'D-14',
    company: 'SK 삼성 하이닉스',
    headcount: '각 분야별 1명 소수 채용( 프론트/백엔드 )',
    requirements: 'Typescript, React, Spring Boot 등 Docker 기반 협업\n성래쌤 직접 기입 내용',
    location: '서울특별시 어디어디어이더 호암로 미림마이스터고\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/ODI1OTgyMDA1NjMw/a/ODU5Mzc2OTUwNTcy/details',
    military: false,
  },
];

const CLOSED_CARDS = [
  {
    id: 5,
    dday: 'D-10',
    company: 'SK 삼성 하이닉스',
    headcount: '각 분야별 1명 소수 채용( 프론트/백엔드 )',
    requirements: 'Typescript, React, Spring Boot 등 Docker 기반 협업\n성래쌤 직접 기입 내용',
    location: '서울특별시 어디어디어이더 호암로 미림마이스터고\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/ODI1OTgyMDA1NjMw/a/ODU5Mzc2OTUwNTcy/details',
    military: true,
  },
  {
    id: 6,
    dday: 'D-3',
    company: 'SK 삼성 하이닉스',
    headcount: '각 분야별 1명 소수 채용( 프론트/백엔드 )',
    requirements: 'Typescript, React, Spring Boot 등 Docker 기반 협업\n성래쌤 직접 기입 내용',
    location: '서울특별시 어디어디어이더 호암로 미림마이스터고\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/ODI1OTgyMDA1NjMw/a/ODU5Mzc2OTUwNTcy/details',
    military: false,
  },
  {
    id: 7,
    dday: 'D-7',
    company: 'SK 삼성 하이닉스',
    headcount: '각 분야별 1명 소수 채용( 프론트/백엔드 )',
    requirements: 'Typescript, React, Spring Boot 등 Docker 기반 협업\n성래쌤 직접 기입 내용',
    location: '서울특별시 어디어디어이더 호암로 미림마이스터고\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/ODI1OTgyMDA1NjMw/a/ODU5Mzc2OTUwNTcy/details',
    military: true,
  },
  {
    id: 8,
    dday: 'D-14',
    company: 'SK 삼성 하이닉스',
    headcount: '각 분야별 1명 소수 채용( 프론트/백엔드 )',
    requirements: 'Typescript, React, Spring Boot 등 Docker 기반 협업\n성래쌤 직접 기입 내용',
    location: '서울특별시 어디어디어이더 호암로 미림마이스터고\n성래쌤 직접 기입 내용',
    classroomLink: 'https://classroom.google.com/u/0/c/ODI1OTgyMDA1NjMw/a/ODU5Mzc2OTUwNTcy/details',
    military: false,
  },
];

// ─── JobCard ──────────────────────────────────────────────────────────────────

function JobCard({ card }: { card: (typeof ACTIVE_CARDS)[0] }) {
  const sections = [
    { label: '채용 인원', content: card.headcount },
    { label: '지원 요건', content: card.requirements },
    { label: '회사 위치', content: card.location },
    { label: '클래스룸 링크', content: card.classroomLink },
  ];

  return (
    <div
      className="jobsCard"
      style={{ background: COLORS.darkCard, fontFamily: FONTS.inter }}
    >
      <p className="jobsCardDday">{card.dday}</p>
      <p className="jobsCardLabel">회사명</p>
      <p className="jobsCardCompany" style={{ color: COLORS.primary, fontFamily: FONTS.laundry }}>
        {card.company}
      </p>
      <hr className="jobsCardDivider" />
      {sections.map(({ label, content }) => (
        <div key={label} className="jobsCardSection">
          <p className="jobsCardSectionLabel">{label}</p>
          <p className={`jobsCardSectionContent ${label === '클래스룸 링크' ? 'jobsCardSectionContentBreak' : ''}`}>
            {content}
          </p>
        </div>
      ))}
      {card.military && (
        <p className="jobsCardMilitary" style={{ color: COLORS.primary }}>
          병역 가능
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Jobs() {
  // 섹션1 top: 220px, 섹션2 top: 220 + 카드높이(약310) + 라벨(40) = 570px
  const SECTION1_TOP = 220;
  const CARD_HEIGHT = 310;
  const SECTION2_TOP = SECTION1_TOP + CARD_HEIGHT + 58;

  return (
    <DashboardLayout activePath="/jobs" sidebarTop={332} fillWidth>

      {/* 페이지 타이틀 */}
      <p
        className="jobsPageTitle"
        style={{ fontFamily: FONTS.laundry }}
      >
        취업 의뢰
      </p>

      {/* ── 섹션1: 마감 임박한 공고 ── */}
      <p
        className="jobsSectionLabel"
        style={{ top: SECTION1_TOP, fontFamily: FONTS.inter }}
      >
        마감 임박한 공고
      </p>
      <div
        className="jobsGrid"
        style={{ top: SECTION1_TOP + 22 }}
      >
        {ACTIVE_CARDS.map((card) => (
          <JobCard key={card.id} card={card} />
        ))}
      </div>

      {/* ── 섹션2: 마감된 공고 ── */}
      <p
        className="jobsSectionLabel"
        style={{ top: SECTION2_TOP, fontFamily: FONTS.inter }}
      >
        마감된 공고
      </p>
      <div
        className="jobsGrid"
        style={{ top: SECTION2_TOP + 22 }}
      >
        {CLOSED_CARDS.map((card) => (
          <JobCard key={card.id} card={card} />
        ))}
      </div>

    </DashboardLayout>
  );
}