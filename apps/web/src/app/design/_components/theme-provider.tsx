'use client';

import { createContext, use, useSyncExternalStore, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  DEFAULT_STATE,
  DENSITIES,
  FONTS,
  MODES,
  STORAGE_KEY,
  THEMES,
  type DensityId,
  type FontId,
  type ModeId,
  type Persisted,
  type ThemeId,
} from './theme-constants';

// Re-export constants & types so existing client-side imports from this module
// keep working. Server Components must import from `./theme-constants` directly
// (see the comment in that file).
export {
  DEFAULT_STATE,
  DENSITIES,
  DENSITY_LABELS,
  FONTS,
  FONT_LABELS,
  MODES,
  STORAGE_KEY,
  THEMES,
  THEME_BLURBS,
  THEME_LABELS,
  type DensityId,
  type FontId,
  type ModeId,
  type Persisted,
  type ThemeId,
} from './theme-constants';

type ThemeState = Persisted & {
  setTheme: (theme: ThemeId) => void;
  setMode: (mode: ModeId) => void;
  setFont: (font: FontId) => void;
  setDensity: (density: DensityId) => void;
};

// ---------------------------------------------------------------------------
// External store — the source of truth is localStorage. Using
// useSyncExternalStore keeps us off the "setState in effect" anti-pattern and
// gives us cross-tab sync for free via the `storage` event.
// ---------------------------------------------------------------------------

const listeners = new Set<() => void>();
let cachedSnapshot: Persisted = DEFAULT_STATE;
let cachedRaw: string | null | undefined;

function isPersisted(value: unknown): value is Persisted {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.theme === 'string' &&
    (THEMES as readonly string[]).includes(v.theme) &&
    typeof v.mode === 'string' &&
    (MODES as readonly string[]).includes(v.mode) &&
    typeof v.font === 'string' &&
    (FONTS as readonly string[]).includes(v.font) &&
    typeof v.density === 'string' &&
    (DENSITIES as readonly string[]).includes(v.density)
  );
}

function readSnapshot(): Persisted {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedSnapshot;
  cachedRaw = raw;
  if (raw === null) {
    cachedSnapshot = DEFAULT_STATE;
    return cachedSnapshot;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    cachedSnapshot = isPersisted(parsed) ? parsed : DEFAULT_STATE;
  } catch {
    cachedSnapshot = DEFAULT_STATE;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): Persisted {
  return DEFAULT_STATE;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function writeState(next: Persisted) {
  try {
    const raw = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedSnapshot = next;
  } catch {
    cachedSnapshot = next;
  }
  listeners.forEach((l) => {
    l();
  });
}

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const state = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);

  const value: ThemeState = {
    ...state,
    setTheme: (theme) => {
      writeState({ ...state, theme });
    },
    setMode: (mode) => {
      writeState({ ...state, mode });
    },
    setFont: (font) => {
      writeState({ ...state, font });
    },
    setDensity: (density) => {
      writeState({ ...state, density });
    },
  };

  // IMPORTANT: the `data-theme` / `data-font` / `data-density` attributes and
  // the `.dark` class MUST live on the same element, because sandbox.css uses
  // compound selectors like `[data-theme='graphite'].dark`. This wrapper is
  // that element — scoping the theme to the sandbox subtree instead of the
  // root <html> keeps production routes untouched.
  //
  // useSyncExternalStore uses getServerSnapshot for SSR + initial hydration,
  // so there's no hydration mismatch; the subscription takes over after mount
  // and swaps to the localStorage-backed value. Kept suppressHydrationWarning
  // as cheap insurance in case a browser extension pokes these attributes.
  return (
    <ThemeContext value={value}>
      <div
        className={cn(className, state.mode === 'dark' && 'dark')}
        data-theme={state.theme}
        data-font={state.font}
        data-density={state.density}
        suppressHydrationWarning
      >
        {children}
      </div>
    </ThemeContext>
  );
}

export function useTheme(): ThemeState {
  const ctx = use(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
