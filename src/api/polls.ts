import { apiFetch } from './client';

export interface PollOption {
  id: string;
  content: string;
  sortOrder: number;
  voteCount: number | null;
  voters: string[];
}

export interface Poll {
  id: string;
  title: string;
  status: string;
  isClosed: boolean;
  createdAt: string | null;
  allowMultiple: boolean;
  isAnonymous: boolean;
  createdBy: string | null;
  totalVoters: number;
  options: PollOption[];
}

export interface CreatePollInput {
  title: string;
  options: string[];
  allowMultiple?: boolean;
  isAnonymous?: boolean;
  status?: 'draft' | 'active';
}

export function listPolls() {
  return apiFetch<Poll[]>('/polls');
}

export function getPoll(pollId: string) {
  return apiFetch<Poll>(`/polls/${pollId}`);
}

export function createPoll(input: CreatePollInput) {
  return apiFetch<Poll>('/polls', {
    method: 'POST',
    body: JSON.stringify({ ...input, status: input.status ?? 'active' }),
  });
}

export function votePoll(pollId: string, optionId: string) {
  return apiFetch<Poll>(`/polls/${pollId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ optionId }),
  });
}

export function closePoll(pollId: string, isClosed = true) {
  return apiFetch<Poll>(`/polls/${pollId}/close`, {
    method: 'PATCH',
    body: JSON.stringify({ isClosed }),
  });
}
