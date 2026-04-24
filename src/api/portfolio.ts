import { apiFetch } from './client';

export interface PortfolioItem {
  id: string;
  studentId: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface PortfolioDownloadUrl {
  url: string;
  expiresIn: number;
}

export function uploadMyPortfolio(file: File) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch<PortfolioItem>('/portfolio/me', {
    method: 'POST',
    body: form,
  });
}

export function getMyPortfolios() {
  return apiFetch<PortfolioItem[]>('/portfolio/me');
}

export function getAllPortfolios() {
  return apiFetch<PortfolioItem[]>('/portfolio');
}

export function getPortfolioDownloadUrl(portfolioId: string, expiresIn = 300) {
  return apiFetch<PortfolioDownloadUrl>(
    `/portfolio/${portfolioId}/download-url?expiresIn=${expiresIn}`,
  );
}

const signedUrlCache = new Map<
  string,
  { url: string; expiresAt: number }
>();

export async function getCachedSignedUrl(portfolioId: string): Promise<string> {
  const hit = signedUrlCache.get(portfolioId);
  const now = Date.now();
  if (hit && hit.expiresAt > now + 10_000) {
    return hit.url;
  }
  const res = await getPortfolioDownloadUrl(portfolioId, 300);
  signedUrlCache.set(portfolioId, {
    url: res.url,
    expiresAt: now + res.expiresIn * 1000,
  });
  return res.url;
}
