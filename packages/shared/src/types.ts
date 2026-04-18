/**
 * Cross-cutting types shared between the web and api apps.
 * Intentionally minimal — used to prove the cross-package wiring at bootstrap.
 */

export type HealthStatus = 'ok' | 'degraded' | 'down';

export interface HealthResponse {
  status: HealthStatus;
  uptime: number;
  timestamp: string;
}
