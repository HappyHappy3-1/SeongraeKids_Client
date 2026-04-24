import type { BackendRole } from '../constants';
import { apiFetch } from './client';

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
  requiresEmailConfirm?: boolean;
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function signUp(
  email: string,
  password: string,
  name?: string,
  role?: BackendRole,
) {
  return apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, role }),
  });
}

export function resendConfirmation(email: string) {
  return apiFetch<{ ok: true }>('/auth/resend-confirmation', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function setMyRole(role: BackendRole) {
  return apiFetch<{ role: BackendRole }>('/auth/me/role', {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
}
