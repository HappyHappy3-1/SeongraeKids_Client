import { apiFetch } from './client';

export interface RecruitmentPost {
  id: string;
  company_name: string;
  headcount: number;
  location: string;
  classroom_link: string | null;
  military_service_available: boolean;
  deadline: string | null;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function listRecruitmentPosts() {
  return apiFetch<RecruitmentPost[]>('/recruitment-posts');
}

export function createRecruitmentPost(
  post: Omit<
    RecruitmentPost,
    'id' | 'created_by' | 'created_at' | 'updated_at'
  >,
) {
  return apiFetch<RecruitmentPost>('/recruitment-posts', {
    method: 'POST',
    body: JSON.stringify(post),
  });
}

export function updateRecruitmentPost(
  id: string,
  patch: Partial<
    Omit<RecruitmentPost, 'id' | 'created_by' | 'created_at' | 'updated_at'>
  >,
) {
  return apiFetch<RecruitmentPost>(`/recruitment-posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export function deleteRecruitmentPost(id: string) {
  return apiFetch<{ ok: true }>(`/recruitment-posts/${id}`, {
    method: 'DELETE',
  });
}
