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
