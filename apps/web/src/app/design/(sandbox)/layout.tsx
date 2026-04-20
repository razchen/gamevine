import type { ReactNode } from 'react';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import { DesignNav } from '../_components/design-nav';
import { ThemeProvider } from '../_components/theme-provider';
import { ThemeSwitcher } from '../_components/theme-switcher';
import '../_styles/sandbox.css';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Design sandbox · Gamevine',
  description: 'Theme / palette / font / density scratchpad.',
  robots: { index: false, follow: false },
};

/**
 * Sandbox shell. Every page under this route group inherits:
 *   - Plus Jakarta Sans + Space Grotesk font variables.
 *   - The sandbox's own `ThemeProvider` (manages `--color-gv-*` tokens via
 *     `data-theme` / `data-font` / `data-density` and the `.dark` class).
 *   - The ThemeSwitcher + DesignNav sidebar.
 *
 * Route-group parentheses don't affect URLs — `/design`, `/design/browse`,
 * etc. still resolve. The parent `../layout.tsx` handles the flag gate.
 */
export default function DesignSandboxLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      className={`${plusJakarta.variable} ${spaceGrotesk.variable} gv-sandbox-root gv-font gv-bg min-h-dvh`}
    >
      <div className="mx-auto grid min-h-dvh w-full max-w-[1400px] grid-cols-[260px_minmax(0,1fr)] gap-6 px-6 py-8">
        <aside className="sticky top-8 flex h-fit flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--color-gv-text-muted)] uppercase">
              Gamevine
            </span>
            <span className="font-heading text-lg font-semibold">Design sandbox</span>
            <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
              Preview surfaces before committing to a palette.
            </span>
          </div>
          <ThemeSwitcher />
          <DesignNav />
        </aside>
        <main className="flex min-w-0 flex-col gap-8">{children}</main>
      </div>
    </ThemeProvider>
  );
}
