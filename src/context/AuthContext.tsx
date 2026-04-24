import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch } from '../api/client';

export type SupabaseRole =
  | 'student'
  | 'teacher'
  | 'president'
  | 'vice_president'
  | 'admin';

export interface ProfileData {
  id: string;
  school_email: string;
  name: string;
  role: SupabaseRole;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  profile: ProfileData | null;
  userId: string | null;
  email: string | null;
  name: string | null;
  role: SupabaseRole | null;
  isTeacher: boolean;
  isStaff: boolean;
  isClassOfficer: boolean;
  isStudent: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  applySession: (
    accessToken: string,
    userId?: string,
    refreshToken?: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const TEACHER_ROLES: SupabaseRole[] = ['teacher', 'admin'];
const STAFF_ROLES: SupabaseRole[] = [
  'teacher',
  'admin',
  'president',
  'vice_president',
];
const CLASS_OFFICER_ROLES: SupabaseRole[] = ['president', 'vice_president'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const data = await apiFetch<ProfileData>('/profiles/me');
      setProfile(data);
      localStorage.setItem('user_id', data.id);
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('user_role', data.role);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const applySession = useCallback(
    async (accessToken: string, userId?: string, refreshToken?: string) => {
      localStorage.setItem('access_token', accessToken);
      if (userId) localStorage.setItem('user_id', userId);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    setProfile(null);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const errorCode = params.get('error_code');
      const errorDesc = params.get('error_description');
      if (accessToken) {
        void (async () => {
          await applySession(accessToken, undefined, refreshToken ?? undefined);
          window.history.replaceState(
            null,
            '',
            window.location.pathname + window.location.search,
          );
        })();
        return;
      }
      if (errorCode) {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search,
        );
        const msg =
          errorCode === 'otp_expired'
            ? '이메일 인증 링크가 만료되었거나 이미 사용되었습니다. 다시 가입하거나 재전송해주세요.'
            : errorDesc ?? '인증 실패';
        setTimeout(() => {
          window.alert(msg);
          window.location.assign('/signup');
        }, 100);
        return;
      }
    }
    void refresh();
  }, [refresh, applySession]);

  const value = useMemo<AuthState>(() => {
    const role = profile?.role ?? null;
    return {
      profile,
      userId: profile?.id ?? null,
      email: profile?.school_email ?? null,
      name: profile?.name ?? null,
      role,
      isTeacher: role ? TEACHER_ROLES.includes(role) : false,
      isStaff: role ? STAFF_ROLES.includes(role) : false,
      isClassOfficer: role ? CLASS_OFFICER_ROLES.includes(role) : false,
      isStudent: role === 'student',
      loading,
      refresh,
      applySession,
      logout,
    };
  }, [profile, loading, refresh, applySession, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
