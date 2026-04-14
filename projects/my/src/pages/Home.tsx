import DashboardLayout from '../components/DashboardLayout';
import { COLORS, FONTS } from '../constants';

const JOB_CARDS = [
  { left: 244, width: 249 },
  { left: 525, width: 249 },
  { left: 806, width: 191 },
];

const ANNOUNCEMENTS_Y = [773, 804, 835, 866, 897];
const SCHEDULE_Y = [365, 400, 435, 471, 507, 543, 579];
const SCHEDULE_HIGHLIGHT_INDEX = 5;
const DAY_X = [1059, 1106, 1152, 1199, 1245, 1292, 1339];
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const TODAY = 4;
const MEALS = ['숯불치킨덮밥', '달걀파국', '미나리무생채', '휘핑딸기범벅', '갈떡꼬치', '배추김치'];

function JobCard({ left, width }: { left: number; width: number }) {
  const sections = [
    { label: '채용 인원', content: '각 분야별 1명 소수 채용( 프론트/백엔드 )' },
    { label: '지원 요건', content: 'Typescript, React, Spring Boot 등 Docker 기반 협업\n성래쌤 직접 기입 내용' },
    { label: '회사 위치', content: '서울특별시 어디어디어이더 호암로 미림마이스터고\n성래쌤 직접 기입 내용' },
    { label: '클래스룸 링크', content: 'https://classroom.google.com/u/0/c/ODI1OTgyMDA1NjMw/a/ODU5Mzc2OTUwNTcy/details' },
  ];

  return (
    <div className="absolute text-white" style={{ left, top: 301, width, height: 336, background: COLORS.darkCard, borderRadius: 2, fontFamily: FONTS.inter, padding: '26px 21px' }}>
      <p style={{ fontSize: 10, fontWeight: 600 }}>D-10</p>
      <p style={{ fontSize: 7, fontWeight: 600, marginTop: 6 }}>회사명</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: COLORS.primary, fontFamily: FONTS.laundry, marginTop: 1 }}>SK 삼성 하이닉스</p>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', margin: '8px 0' }} />
      {sections.map(({ label, content }) => (
        <div key={label}>
          <p style={{ fontSize: 7, fontWeight: 600, marginTop: 10 }}>{label}</p>
          <p style={{ fontSize: 8, marginTop: 2, color: '#ccc', whiteSpace: 'pre-line', wordBreak: label === '클래스룸 링크' ? 'break-all' : undefined }}>{content}</p>
        </div>
      ))}
      <p style={{ fontSize: 7, fontWeight: 600, marginTop: 10, color: COLORS.primary }}>병역 가능</p>
    </div>
  );
}

function Pos({ left, top, children, ...rest }: { left: number; top: number; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className="absolute" style={{ left, top, ...((rest as { style?: React.CSSProperties }).style || {}) }} {...rest}>{children}</div>;
}

export default function Home() {
  return (
    <DashboardLayout activePath="/home" sidebarTop={332}>
      <div className="absolute bg-white" style={{ left: 225, top: 204, width: 748, height: 444, borderRadius: 10 }} />
      <Pos left={280} top={231} style={{ fontSize: 16, fontFamily: FONTS.laundry }}>마감 임박 취업 의뢰 공고</Pos>
      <Pos left={549} top={231} style={{ fontSize: 16, fontFamily: FONTS.laundry, color: COLORS.gray }}>마감된 취업 의뢰 공고</Pos>
      <div className="absolute" style={{ left: 275, top: 275, width: 174, height: 7, background: COLORS.primary, borderRadius: 3 }} />

      {JOB_CARDS.map((card) => <JobCard key={card.left} {...card} />)}

      <div className="absolute bg-white rounded-full flex items-center justify-center" style={{ left: 978, top: 447, width: 37, height: 37 }}>
        <svg width="6" height="15" viewBox="0 0 6 15" fill="none"><path d="M1 1L5 7.5L1 14" stroke={COLORS.primary} strokeWidth="2" /></svg>
      </div>

      <div className="absolute bg-white" style={{ left: 245, top: 682, width: 769, height: 255, borderRadius: 16 }} />
      <Pos left={262} top={695} style={{ fontSize: 16, fontFamily: FONTS.laundry }}>공지사항</Pos>
      <div className="absolute" style={{ left: 256, top: 737, width: 86, height: 7, background: COLORS.primary, borderRadius: 3 }} />
      <div className="absolute" style={{ left: 256, top: 740, width: 741, height: 2, background: COLORS.primary }} />
      <Pos left={926} top={714} style={{ fontSize: 13, fontFamily: FONTS.laundry }}>더보기</Pos>
      {ANNOUNCEMENTS_Y.map((y) => (
        <div key={y}>
          <Pos left={251} top={y} style={{ fontSize: 13, fontWeight: 500, fontFamily: FONTS.inter }}>이번주 CA 는 멘토링 입니다~ 성래쌤 직접 기입 내용~~</Pos>
          <Pos left={912} top={y} style={{ fontSize: 13, fontWeight: 500, fontFamily: FONTS.inter }}>2026.04.23</Pos>
        </div>
      ))}

      <div className="absolute bg-white" style={{ left: 1034, top: 190, width: 370, height: 450, borderRadius: 20 }} />
      <Pos left={1068} top={217} style={{ fontSize: 16, fontWeight: 700, fontFamily: FONTS.laundry }}>오늘, 수요일! 냐르!</Pos>
      <Pos left={1197} top={239} style={{ fontSize: 10, fontWeight: 500, fontFamily: FONTS.inter, color: COLORS.subtleGray }}>2026.04.23</Pos>

      {DAYS.map((d, i) => (
        <Pos key={d} left={DAY_X[i]} top={268} style={{ width: 33, height: 33, fontSize: 13, fontWeight: 500, fontFamily: FONTS.inter, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d}</Pos>
      ))}
      {[1, 2, 3, 4, 5, 6, 7].map((d, i) => (
        <Pos key={`n${d}`} left={DAY_X[i]} top={301} style={{ width: 33, height: 33, fontSize: 23, fontWeight: 500, fontFamily: FONTS.inter, color: d === TODAY ? '#fff' : '#000', zIndex: d === TODAY ? 1 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {d === TODAY && <div className="absolute rounded-full" style={{ width: 29, height: 29, background: COLORS.primary, zIndex: -1 }} />}
          {d}
        </Pos>
      ))}

      <div className="absolute" style={{ left: 1062, top: 352, width: 320, height: 2, background: COLORS.primary }} />
      {SCHEDULE_Y.map((y, i) => (
        <div key={y}>
          <div className="absolute rounded-full" style={{ left: 1065, top: y + 8, width: 10, height: 10, background: i === SCHEDULE_HIGHLIGHT_INDEX ? COLORS.primary : COLORS.dotGray, border: `1px solid ${COLORS.dotGray}` }} />
          {i < 6 && <div className="absolute" style={{ left: 1069, top: y + 16, width: 2, height: 30, background: COLORS.dotGray }} />}
          <Pos left={1092} top={y} style={{ fontSize: 13, fontWeight: 600, fontFamily: FONTS.pretendard, color: i === SCHEDULE_HIGHLIGHT_INDEX ? COLORS.primary : COLORS.scheduleGray }}>
            SK 삼성 하이닉스 마감
          </Pos>
        </div>
      ))}

      <div className="absolute bg-white" style={{ left: 1034, top: 657, width: 370, height: 280, borderRadius: 20 }} />
      {[{ label: '조식', x: 1062 }, { label: '중식', x: 1182 }, { label: '석식', x: 1302 }].map(({ label, x }) => (
        <div key={label}>
          <Pos left={x} top={687} style={{ fontSize: 16, fontFamily: FONTS.laundry }}>{label}</Pos>
          <Pos left={x - 2} top={755} style={{ fontSize: 13, fontWeight: 600, fontFamily: FONTS.pretendard, lineHeight: '21.5px', whiteSpace: 'pre-line' }}>
            {MEALS.join('\n')}
          </Pos>
        </div>
      ))}
      <div className="absolute" style={{ left: 1055, top: 729, width: 86, height: 7, background: COLORS.primary, borderRadius: 3 }} />
    </DashboardLayout>
  );
}
