import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PsyduckFace from '../components/PsyduckFace';
import { useScaledViewport } from '../hooks/useScaledViewport';
import { COLORS, FONTS, DESIGN } from '../constants';

export default function Login() {
  const navigate = useNavigate();
  const { scale, offsetX } = useScaledViewport();
  const [splitY, setSplitY] = useState(453);

  useEffect(() => { setSplitY(453 * scale); }, [scale]);

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${COLORS.primary} ${splitY}px, ${COLORS.white} ${splitY}px)` }} />
      <div className="relative" style={{
        width: DESIGN.width, height: DESIGN.height,
        transform: `translateX(${offsetX}px) scale(${scale})`, transformOrigin: 'top left',
      }}>
        <div className="relative w-full h-full" style={{ background: COLORS.primary }}>
          <div className="absolute bg-white" style={{ left: -15, top: 453, width: 1470, height: 606 }} />
          <PsyduckFace className="absolute" width={380} height={320} style={{ left: 530, top: 80 }} />
          <div className="absolute flex items-center justify-center whitespace-nowrap"
            style={{ left: 484, top: 453, width: 493, height: 147, fontSize: 50, fontWeight: 700, fontFamily: FONTS.laundry, color: COLORS.black }}>
            로그인
          </div>
          <div className="absolute bg-white border-[3px] border-[#FDCB35] rounded-[5px] flex items-center"
            style={{ left: 340, top: 619, width: 759, height: 73, padding: '0 23px' }}>
            <svg width="33" height="35" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mr-4">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill={COLORS.primary} />
            </svg>
            <input type="text" placeholder="풀이름 입력해주세용"
              className="flex-1 border-none outline-none bg-transparent text-center"
              style={{ fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }} />
          </div>
          <div className="absolute bg-white border-[3px] border-[#FDCB35] rounded-[5px] flex items-center justify-center"
            style={{ left: 340, top: 720, width: 759, height: 73, padding: '0 23px' }}>
            <input type="password" placeholder="비밀번호 ㄱ "
              className="flex-1 border-none outline-none bg-transparent text-center"
              style={{ fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }} />
          </div>
          <button onClick={() => navigate('/home')}
            className="absolute border-[3px] border-[#FDCB35] rounded-[5px] cursor-pointer flex items-center justify-center"
            style={{ left: 340, top: 866, width: 759, height: 73, background: COLORS.primary, fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
