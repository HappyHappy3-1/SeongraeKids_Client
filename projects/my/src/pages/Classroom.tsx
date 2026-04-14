import DashboardLayout from '../components/DashboardLayout';
import { COLORS, FONTS } from '../constants';

const POST_Y = [679, 710, 741, 772, 803];
const VOTE_OPTIONS = ['민재 바보오다(민바보)', '민재 푸바오다(민바오)'];

function BallotIcon() {
  return (
    <svg width="21" height="24" viewBox="0 0 21 24" fill="none">
      <rect x="0.5" y="0.5" width="20" height="23" rx="2" stroke={COLORS.primary} />
      {[3, 12].map((x) => [6, 14].map((y) => (
        <rect key={`${x}${y}`} x={x} y={y} width="6" height="4" fill={COLORS.primary} />
      )))}
    </svg>
  );
}

export default function Classroom() {
  return (
    <DashboardLayout activePath="/classroom" sidebarTop={326}>
      <div className="absolute bg-white" style={{ left: 249, top: 216, width: 515, height: 334, borderRadius: 15 }} />
      <div className="absolute" style={{ left: 330, top: 244, width: 353, fontSize: 20, fontWeight: 600, fontFamily: FONTS.pretendard }}>
        민바오는 민재 바보오 일까 민재 푸바오일까
      </div>

      <div className="absolute bg-white" style={{ left: 323, top: 305, width: 364, height: 215, borderRadius: 8 }} />
      <div className="absolute flex items-center gap-2" style={{ left: 336, top: 316, fontSize: 13, fontWeight: 600, fontFamily: FONTS.pretendard }}>
        <BallotIcon /> 투표
      </div>

      {VOTE_OPTIONS.map((option, i) => (
        <div key={option} className="absolute flex items-center"
          style={{ left: 337, top: 363 + i * 40, width: 338, height: 33, background: COLORS.optionBg, borderRadius: 2 }}>
          <div className="rounded-full ml-3" style={{ width: 6, height: 6, border: '2px solid #999' }} />
          <span className="ml-3" style={{ fontSize: 13, fontWeight: 600, fontFamily: FONTS.pretendard }}>{option}</span>
        </div>
      ))}

      <div className="absolute flex items-center justify-center cursor-pointer"
        style={{ left: 337, top: 464, width: 338, height: 33, background: COLORS.primary, borderRadius: 2, fontSize: 13, fontWeight: 600, fontFamily: FONTS.pretendard }}>
        투표하기
      </div>

      <div className="absolute" style={{ left: 801, top: 216, width: 525, height: 334, background: COLORS.primary, borderRadius: 13 }} />
      <div className="absolute" style={{ left: 888, top: 244, width: 353, fontSize: 20, fontWeight: 600, fontFamily: FONTS.pretendard }}>학급 회의</div>
      <div className="absolute" style={{ left: 888, top: 293, width: 353, fontSize: 20, fontWeight: 600, fontFamily: FONTS.pretendard }}>이번달 대의원회의 주제는</div>
      <div className="absolute whitespace-pre-line" style={{ left: 888, top: 380, width: 353, fontSize: 30, fontWeight: 600, fontFamily: FONTS.pretendard, lineHeight: '44px' }}>
        {'어떻게 하면 체육대회를 잘 놀\n수  잇을까???????? 입니다'}
      </div>

      <div className="absolute bg-white" style={{ left: 242, top: 588, width: 1084, height: 255, borderRadius: 16 }} />
      {[
        { label: '전체', x: 266, active: true },
        { label: '투표', x: 410, active: false },
        { label: '회의', x: 544, active: false },
      ].map(({ label, x, active }) => (
        <div key={label} className="absolute" style={{ left: x, top: 601, fontSize: 16, fontFamily: FONTS.laundry, color: active ? COLORS.black : COLORS.gray }}>{label}</div>
      ))}
      <div className="absolute" style={{ left: 256, top: 643, width: 121, height: 7, background: COLORS.primary, borderRadius: 3 }} />
      <div className="absolute" style={{ left: 258, top: 646, width: 1045, height: 2, background: COLORS.primary }} />
      <div className="absolute" style={{ left: 1202, top: 620, fontSize: 13, fontFamily: FONTS.laundry }}>더보기</div>

      {POST_Y.map((y) => (
        <div key={y}>
          <div className="absolute" style={{ left: 250, top: y, fontSize: 13, fontWeight: 500, fontFamily: FONTS.inter }}>민바오는 민재 바보오 일까 민재 푸바오 일까~~~~~~~</div>
          <div className="absolute" style={{ left: 1182, top: y, fontSize: 13, fontWeight: 500, fontFamily: FONTS.inter }}>2026.04.23</div>
        </div>
      ))}
    </DashboardLayout>
  );
}
