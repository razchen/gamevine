import type { ReactNode } from 'react';
import Link from 'next/link';
import { Toaster } from '@/components/ui/sonner';
import { UiNav } from './_components/ui-nav';

export const metadata = {
  title: 'UI · Design · Gamevine',
  description:
    'Production-token component gallery. Renders real shadcn primitives against Graphite tokens.',
  robots: { index: false, follow: false },
};

/**
 * Gallery shell.
 *
 * Inherits Geist (sans + mono) from the root layout — no extra font wiring.
 * Theme handling is already driven by `next-themes` in `providers.tsx`, so
 * `<html>` carries `light` or `dark` and every production token resolves
 * automatically. Side-by-side previews are scoped per-example via
 * `ComponentExample` using the `.light` / `.dark` aliases in globals.css.
 *
 * Mounts a single `<Toaster />` (sonner) so any page in the gallery can
 * trigger toast examples without each one installing its own. Scoped to
 * `/design/ui` on purpose — production surfaces shouldn't inherit a toaster
 * until the product decides where toasts live.
 */
export default function UiGalleryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto grid min-h-dvh w-full max-w-[1400px] grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="flex h-fit flex-col gap-6 md:sticky md:top-8">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.24em] uppercase">
              Gamevine
            </span>
            <span className="text-foreground text-base font-semibold">UI gallery</span>
            <span className="text-muted-foreground text-[11px]">
              Production tokens from <code className="font-mono text-[10px]">globals.css</code>.
            </span>
            <Link
              href="/design"
              className="text-muted-foreground hover:text-foreground text-[11px] underline-offset-2 hover:underline"
            >
              ← palette sandbox
            </Link>
          </div>
          <UiNav />
        </aside>
        <main className="flex min-w-0 flex-col gap-10">{children}</main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
