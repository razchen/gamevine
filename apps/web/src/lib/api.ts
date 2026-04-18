import axios, { type AxiosInstance } from 'axios';
import { API_HEALTH_PATH, type HealthResponse } from '@gamevine/shared';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10_000,
  withCredentials: true,
});

/**
 * Minimal health check helper. Currently unused in the UI — present as a
 * template for future feature-level clients.
 */
export async function fetchHealth(): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>(API_HEALTH_PATH);
  return response.data;
}
