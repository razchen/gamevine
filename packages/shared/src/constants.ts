/**
 * Application-wide constants shared between the web and api apps.
 * Keep this file tiny — anything product-specific belongs in its own package.
 */

export const APP_NAME = 'Gamevine.ai' as const;
export const APP_TAGLINE = 'Browser-based games, community-driven updates.' as const;
export const API_HEALTH_PATH = '/health' as const;
export const DEFAULT_API_PORT = 3001 as const;
export const DEFAULT_WEB_PORT = 3000 as const;
