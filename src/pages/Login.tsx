import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PsyduckFace from '../components/PsyduckFace';
import { useScaledViewport } from '../hooks/useScaledViewport';
import { COLORS, FONTS, DESIGN } from '../constants';
import { login } from '../api/auth';

export default function Login() {
  const navigate = useNavigate();
  const { scale, offsetX } = useScaledViewport();
  const [splitY, setSplitY] = useState(453);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { setSplitY(453 * scale); }, [scale]);

  const handleLogin = async () => {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.session?.access_token) {
        localStorage.setItem('access_token', res.session.access_token);
      }
      if (res.user?.id) localStorage.setItem('user_id', res.user.id);
      const metaRole =
        (res.user?.user_metadata as { role?: string } | undefined)?.role;
      const metaName =
        (res.user?.user_metadata as { name?: string } | undefined)?.name;
      if (metaRole && !localStorage.getItem('user_role')) {
        localStorage.setItem(
          'user_role',
          metaRole === 'teacher' ? 'teacher' : 'student',
        );
      }
      if (metaName && !localStorage.getItem('user_name')) {
        localStorage.setItem('user_name', metaName);
      }
      navigate('/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : '로그인 실패');
    } finally {
      setSubmitting(false);
    }
  };

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
            <input type="email" placeholder="이메일을 입력해주세용"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-none outline-none bg-transparent text-center"
              style={{ fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }} />
          </div>
          <div className="absolute bg-white border-[3px] border-[#FDCB35] rounded-[5px] flex items-center justify-center"
            style={{ left: 340, top: 720, width: 759, height: 73, padding: '0 23px' }}>
            <input type="password" placeholder="비밀번호 ㄱ "
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
              className="flex-1 border-none outline-none bg-transparent text-center"
              style={{ fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }} />
          </div>
          {error && (
            <div className="absolute text-center"
              style={{ left: 340, top: 810, width: 759, fontSize: 16, fontFamily: FONTS.laundry, color: '#d33' }}>
              {error}
            </div>
          )}
          <button onClick={handleLogin} disabled={submitting}
            className="absolute border-[3px] border-[#FDCB35] rounded-[5px] cursor-pointer flex items-center justify-center disabled:opacity-60"
            style={{ left: 340, top: 866, width: 759, height: 73, background: COLORS.primary, fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }}>
            {submitting ? '로그인 중...' : '로그인'}
          </button>
          <button onClick={() => navigate('/signup')}
            className="absolute cursor-pointer"
            style={{ left: 340, top: 955, width: 759, fontSize: 16, fontFamily: FONTS.laundry, color: COLORS.subtleGray, background: 'transparent', border: 'none' }}>
            아직 계정이 없어요 · 회원가입하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
