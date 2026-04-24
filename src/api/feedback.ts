import { apiFetch } from './client';

export interface FeedbackItem {
  id: string;
  portfolio_id: string;
  teacher_id: string;
  feedback_text: string;
  created_at: string;
}

export function listFeedback(portfolioId: string) {
  return apiFetch<FeedbackItem[]>(`/portfolio/${portfolioId}/feedback`);
}

export function addFeedback(portfolioId: string, text: string) {
  return apiFetch<FeedbackItem>(`/portfolio/${portfolioId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export function deleteFeedback(portfolioId: string, feedbackId: string) {
  return apiFetch<{ ok: true }>(
    `/portfolio/${portfolioId}/feedback/${feedbackId}`,
    { method: 'DELETE' },
  );
}
