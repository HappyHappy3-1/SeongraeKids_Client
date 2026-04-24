import { apiFetch } from './client';
import type { ProfileData, SupabaseRole } from '../context/AuthContext';

export function getMyProfile() {
  return apiFetch<ProfileData>('/profiles/me');
}

export function listStudents() {
  return apiFetch<ProfileData[]>('/profiles/students');
}

export function getProfile(id: string) {
  return apiFetch<ProfileData>(`/profiles/${id}`);
}

export function updateProfileRole(id: string, role: SupabaseRole) {
  return apiFetch<ProfileData>(`/profiles/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}
