'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';

/**
 * Client-side provider tree.
 *
 * `ThemeProvider` (from `next-themes`) sits outermost so the theme class on
 * `<html>` is in place before any descendant reads a CSS custom property.
 * Options:
 *   - attribute="class"        — matches globals.css's `@custom-variant dark (&:is(.dark *))`.
 *   - defaultTheme="system"    — respect OS preference; no in-app toggle exists yet.
 *   - enableSystem             — "system" stays a recognized explicit choice
 *                                 for when a toggle UI lands.
 *   - disableTransitionOnChange — suppress the one-frame color flash on flip.
 *
 * TanStack Query (the library formerly called React Query; package is
 * `@tanstack/react-query`) is nested inside. The QueryClient is created
 * lazily inside the component so each React tree gets its own instance and
 * Next's RSC boundaries are respected.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
