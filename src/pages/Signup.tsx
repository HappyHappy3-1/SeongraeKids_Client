import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PsyduckFace from '../components/PsyduckFace';
import { useScaledViewport } from '../hooks/useScaledViewport';
import { useIsMobile } from '../hooks/useIsMobile';
import {
  COLORS,
  FONTS,
  DESIGN,
  ROLE_OPTIONS,
  type UserRole,
} from '../constants';
import { resendConfirmation, signUp } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Signup() {
  const navigate = useNavigate();
  const { applySession } = useAuth();
  const toast = useToast();
  const isMobile = useIsMobile();
  const { scale, offsetX } = useScaledViewport();
  const [splitY, setSplitY] = useState(300);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => { setSplitY(300 * scale); }, [scale]);

  const handleSubmit = async () => {
    if (submitting) return;
    setError(null);
    if (!name.trim()) return setError('이름을 입력해주세요.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('올바른 이메일 형식이 아닙니다.');
    if (!/@e-mirim\.hs\.kr$/i.test(email.trim()))
      return setError('미림마이스터고 이메일(@e-mirim.hs.kr)로만 가입 가능합니다.');
    if (password.length < 6) return setError('비밀번호는 6자 이상이어야 합니다.');
    setSubmitting(true);
    try {
      const res = await signUp(email, password, name.trim(), role);
      if (res.session?.access_token && res.user?.id) {
        await applySession(
          res.session.access_token,
          res.user.id,
          res.session.refresh_token,
        );
        toast.success('회원가입 완료!');
        const isTeacher = role === 'teacher';
        navigate(isTeacher ? '/manage' : '/home');
      } else if (res.requiresEmailConfirm || res.user) {
        setVerificationEmail(email.trim());
        toast.info('인증 메일이 발송되었습니다.');
      } else {
        navigate('/login');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '회원가입 실패');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!verificationEmail || resending) return;
    setResending(true);
    try {
      await resendConfirmation(verificationEmail);
      toast.success('인증 메일을 다시 보냈어요.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '재전송 실패');
    } finally {
      setResending(false);
    }
  };

  if (verificationEmail) {
    return (
      <div
        className="w-screen flex items-center justify-center"
        style={{ minHeight: '100vh', background: COLORS.primary, padding: 24 }}
      >
        <div
          style={{
            background: COLORS.white,
            borderRadius: 24,
            maxWidth: 420,
            width: '100%',
            padding: '40px 28px',
            textAlign: 'center',
            boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: COLORS.primary,
              color: COLORS.black,
              fontSize: 36,
              fontWeight: 700,
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONTS.laundry,
            }}
          >
            ✉
          </div>
          <div
            style={{
              fontFamily: FONTS.laundry,
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.black,
              marginBottom: 10,
            }}
          >
            이메일 인증 메일 발송
          </div>
          <div
            style={{
              fontFamily: FONTS.pretendard ?? 'Pretendard, Inter, sans-serif',
              fontSize: 15,
              color: COLORS.subtleGray,
              lineHeight: 1.5,
              marginBottom: 24,
            }}
          >
            <strong style={{ color: COLORS.black }}>{verificationEmail}</strong> 로 <br />
            인증 링크를 보냈어요. <br />
            메일함(스팸함 포함)을 확인해서 <br />
            링크를 클릭하면 가입이 완료됩니다.
          </div>
          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 8,
              border: `3px solid ${COLORS.primary}`,
              background: COLORS.white,
              color: COLORS.black,
              fontFamily: FONTS.laundry,
              fontSize: 16,
              fontWeight: 700,
              cursor: resending ? 'default' : 'pointer',
              opacity: resending ? 0.6 : 1,
              marginBottom: 10,
            }}
          >
            {resending ? '전송 중…' : '인증 메일 다시 보내기'}
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              height: 44,
              border: 'none',
              background: 'transparent',
              color: COLORS.subtleGray,
              fontFamily: FONTS.laundry,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            로그인 화면으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: COLORS.primary,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 20px',
        }}
      >
        <PsyduckFace width={120} height={100} />
        <div
          style={{
            fontFamily: FONTS.laundry,
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.black,
            marginTop: 12,
            marginBottom: 20,
          }}
        >
          회원가입
        </div>
        <div
          style={{
            background: COLORS.white,
            width: '100%',
            maxWidth: 420,
            padding: 24,
            borderRadius: 20,
            boxShadow: '0 18px 40px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            autoComplete="name"
            style={{
              height: 48,
              padding: '0 14px',
              border: `2px solid ${COLORS.primary}`,
              borderRadius: 10,
              fontSize: 16,
              fontFamily: FONTS.laundry,
              outline: 'none',
            }}
          />
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="이메일 (@e-mirim.hs.kr)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            style={{
              height: 48,
              padding: '0 14px',
              border: `2px solid ${COLORS.primary}`,
              borderRadius: 10,
              fontSize: 16,
              fontFamily: FONTS.laundry,
              outline: 'none',
            }}
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            style={{
              height: 48,
              padding: '0 14px',
              border: `2px solid ${COLORS.primary}`,
              borderRadius: 10,
              fontSize: 16,
              fontFamily: FONTS.laundry,
              outline: 'none',
            }}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
              marginTop: 4,
            }}
          >
            {ROLE_OPTIONS.map((opt) => {
              const selected = role === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  style={{
                    height: 44,
                    border: `2px solid ${COLORS.primary}`,
                    borderRadius: 10,
                    background: selected ? COLORS.primary : COLORS.white,
                    color: selected ? COLORS.black : COLORS.subtleGray,
                    fontFamily: FONTS.laundry,
                    fontSize: 15,
                    fontWeight: selected ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {error && (
            <div style={{ color: '#d33', fontSize: 14, fontFamily: FONTS.laundry, textAlign: 'center', marginTop: 4 }}>
              {error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              height: 52,
              borderRadius: 10,
              border: 'none',
              background: COLORS.primary,
              color: COLORS.black,
              fontFamily: FONTS.laundry,
              fontSize: 18,
              fontWeight: 700,
              cursor: submitting ? 'default' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              marginTop: 4,
            }}
          >
            {submitting ? '가입 중...' : '가입하기'}
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              height: 44,
              border: 'none',
              background: 'transparent',
              color: COLORS.subtleGray,
              fontFamily: FONTS.laundry,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            이미 계정이 있어요 · 로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

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
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              className="flex-1 border-none outline-none bg-transparent text-center"
              style={{ fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }} />
          </div>

          <div className="absolute bg-white border-[3px] border-[#FDCB35] rounded-[5px] flex items-center"
            style={{ left: 340, top: 484, width: 759, height: 64, padding: '0 23px' }}>
            <input type="email" placeholder="이메일 (@e-mirim.hs.kr)"
              value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              className="flex-1 border-none outline-none bg-transparent text-center"
              style={{ fontSize: 20, fontFamily: FONTS.laundry, color: COLORS.placeholder }} />
          </div>

          <div className="absolute bg-white border-[3px] border-[#FDCB35] rounded-[5px] flex items-center"
            style={{ left: 340, top: 568, width: 759, height: 64, padding: '0 23px' }}>
            <input type="password" placeholder="비밀번호 (6자 이상)"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
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
