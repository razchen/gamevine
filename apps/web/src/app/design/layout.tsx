import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import { DesignNav } from './_components/design-nav';
import { ThemeProvider } from './_components/theme-provider';
import { ThemeSwitcher } from './_components/theme-switcher';
import './_styles/sandbox.css';

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
  description: 'Internal theme playground. Not linked from production routes.',
  robots: { index: false, follow: false },
};

export default function DesignSandboxLayout({ children }: { children: ReactNode }) {
  // Hard gate: the sandbox is a dev/preview surface. In production it 404s
  // unless explicitly enabled. The files still exist at build time, so
  // `typedRoutes: true` in next.config.ts stays happy.
  if (process.env.NEXT_PUBLIC_DESIGN_SANDBOX !== '1') {
    notFound();
  }

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
