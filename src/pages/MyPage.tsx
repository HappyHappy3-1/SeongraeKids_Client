import DashboardLayout from '../components/DashboardLayout';
import { FONTS } from '../constants';
import '../mypage.css';

// ─── 임시 데이터 (실제 연동 시 props 또는 API로 교체) ─────────────────────────

const USER_NAME = '김민재';
const FEEDBACK_TEXT = '빨리 정신으로 해주세요 디자인 정확했어요 ㅜㅜ';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyPage() {
  return (
    <DashboardLayout activePath="/mypage" sidebarTop={332} fillWidth>

      {/* 소제목 */}
      <p
        className="mypageSubTitle"
        style={{ fontFamily: FONTS.inter }}
      >
        취업마이스터
      </p>

      {/* 메인 타이틀 */}
      <p
        className="mypageTitle"
        style={{ fontFamily: FONTS.laundry }}
      >
        {USER_NAME}님 하이~
      </p>

      {/* 포트폴리오 업로드 박스 */}
      <div className="mypagePortfolioBox">
        <span
          className="mypagePortfolioBoxText"
          style={{ fontFamily: FONTS.inter }}
        >
          내 포트폴리오 업로드
        </span>
      </div>

      {/* 성래쌤의 피드백 타이틀 */}
      <p
        className="mypageFeedbackTitle"
        style={{ fontFamily: FONTS.laundry }}
      >
        성래쌤의 피드백
      </p>

      {/* 피드백 박스 */}
      <div className="mypageFeedbackBox">
        <span
          className="mypageFeedbackBoxText"
          style={{ fontFamily: FONTS.inter }}
        >
          {FEEDBACK_TEXT}
        </span>
      </div>

    </DashboardLayout>
  );
}