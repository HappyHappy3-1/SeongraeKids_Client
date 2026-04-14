import { useNavigate } from 'react-router-dom';
import ScaledPage from '../components/ScaledPage';
import PsyduckFace from '../components/PsyduckFace';
import { COLORS, FONTS } from '../constants';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <ScaledPage bg={COLORS.primary}>
      <div className="relative w-full h-full" style={{ background: COLORS.primary }}>
        <PsyduckFace className="absolute" width={560} height={470} style={{ left: 440, top: 140 }} />
        <div className="absolute flex items-center justify-center whitespace-nowrap"
          style={{ left: 483, top: 639, width: 493, height: 147, fontSize: 70, fontFamily: FONTS.laundry, color: COLORS.black }}>
          성 래 키 즈
        </div>
        <button onClick={() => navigate('/login')}
          className="absolute flex items-center justify-center bg-white border-[3px] border-black rounded-[32px] cursor-pointer"
          style={{ left: 569, top: 793, width: 301, height: 79, boxShadow: 'inset 0px 4px 6.7px rgba(0,0,0,0.25)', fontSize: 35, fontFamily: FONTS.laundry }}>
          시작하기
        </button>
      </div>
    </ScaledPage>
  );
}
