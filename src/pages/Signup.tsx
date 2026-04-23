import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PsyduckFace from '../components/PsyduckFace';
import { useScaledViewport } from '../hooks/useScaledViewport';
import {
  COLORS,
  FONTS,
  DESIGN,
  ROLE_OPTIONS,
  toBackendRole,
  type UserRole,
} from '../constants';
import { signUp } from '../api/auth';

export default function Signup() {
  const navigate = useNavigate();
  const { scale, offsetX } = useScaledViewport();
  const [splitY, setSplitY] = useState(300);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { setSplitY(300 * scale); }, [scale]);

  const handleSubmit = async () => {
    if (submitting) return;
    setError(null);
    if (!name.trim()) return setError('이름을 입력해주세요.');
    if (password.length < 6) return setError('비밀번호는 6자 이상이어야 합니다.');
    setSubmitting(true);
    try {
      const res = await signUp(email, password, name.trim(), toBackendRole(role));
      localStorage.setItem('user_role', role);
      localStorage.setItem('user_name', name.trim());
      if (res.user?.id) localStorage.setItem('user_id', res.user.id);
      if (res.session?.access_token) {
        localStorage.setItem('access_token', res.session.access_token);
        navigate('/home');
      } else {
        navigate('/login');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '회원가입 실패');
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
          <div className="absolute bg-white" style={{ left: -15, top: 300, width: 1470, height: 760 }} />
          <PsyduckFace className="absolute" width={260} height={220} style={{ left: 590, top: 50 }} />
          <div className="absolute flex items-center justify-center whitespace-nowrap"
            style={{ left: 484, top: 295, width: 493, height: 90, fontSize: 42, fontWeight: 700, fontFamily: FONTS.laundry, color: COLORS.black }}>
            회원가입
          </div>

          <div className="absolute bg-white border-[3px] border-[#FDCB35] rounded-[5px] flex items-center"
            style={{ left: 340, top: 400, width: 759, height: 64, padding: '0 23px' }}>
            <input type="text" placeholder="이름"
              value={name} onChange={(e) => setName(e.target.value)}
              className="flex-1 border-none outline-none bg-transparent text-center"
              style={{ fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }} />
          </div>

          <div className="absolute bg-white border-[3px] border-[#FDCB35] rounded-[5px] flex items-center"
            style={{ left: 340, top: 484, width: 759, height: 64, padding: '0 23px' }}>
            <input type="email" placeholder="이메일"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-none outline-none bg-transparent text-center"
              style={{ fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }} />
          </div>

          <div className="absolute bg-white border-[3px] border-[#FDCB35] rounded-[5px] flex items-center"
            style={{ left: 340, top: 568, width: 759, height: 64, padding: '0 23px' }}>
            <input type="password" placeholder="비밀번호 (6자 이상)"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="flex-1 border-none outline-none bg-transparent text-center"
              style={{ fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }} />
          </div>

          <div className="absolute flex gap-3"
            style={{ left: 340, top: 658, width: 759 }}>
            {ROLE_OPTIONS.map((opt) => {
              const selected = role === opt.value;
              return (
                <button key={opt.value} type="button" onClick={() => setRole(opt.value)}
                  className="flex-1 border-[3px] border-[#FDCB35] rounded-[5px] cursor-pointer"
                  style={{
                    height: 64,
                    background: selected ? COLORS.primary : COLORS.white,
                    color: selected ? COLORS.black : COLORS.placeholder,
                    fontSize: 20, fontFamily: FONTS.laundry, fontWeight: selected ? 700 : 400,
                  }}>
                  {opt.label}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="absolute text-center"
              style={{ left: 340, top: 742, width: 759, fontSize: 16, fontFamily: FONTS.laundry, color: '#d33' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitting}
            className="absolute border-[3px] border-[#FDCB35] rounded-[5px] cursor-pointer flex items-center justify-center disabled:opacity-60"
            style={{ left: 340, top: 780, width: 759, height: 64, background: COLORS.primary, fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }}>
            {submitting ? '가입 중...' : '가입하기'}
          </button>

          <button onClick={() => navigate('/login')}
            className="absolute cursor-pointer"
            style={{ left: 340, top: 860, width: 759, fontSize: 16, fontFamily: FONTS.laundry, color: COLORS.subtleGray, background: 'transparent', border: 'none' }}>
            이미 계정이 있어요 · 로그인하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
