import { apiFetch } from './client';

export interface Notice {
  id: string;
  title: string;
  content: string;
  created_by: string;
  published_at: string;
  updated_at: string;
  event_date: string | null;
}

export function listNotices() {
  return apiFetch<Notice[]>('/notices');
}

export function createNotice(
  title: string,
  content: string,
  event_date?: string | null,
) {
  return apiFetch<Notice>('/notices', {
    method: 'POST',
    body: JSON.stringify({ title, content, event_date: event_date ?? null }),
  });
}

export function updateNotice(
  id: string,
  patch: { title?: string; content?: string; event_date?: string | null },
) {
  return apiFetch<Notice>(`/notices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export function deleteNotice(id: string) {
  return apiFetch<{ ok: true }>(`/notices/${id}`, { method: 'DELETE' });
}
