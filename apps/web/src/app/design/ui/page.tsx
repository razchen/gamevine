import Link from 'next/link';
import { UI_NAV } from './_components/ui-nav-items';

const CARDS = UI_NAV.filter((item) => item.href !== '/design/ui');

const BLURBS: Record<string, string> = {
  '/design/ui/buttons': 'Every variant × size × state × lucide icon combination.',
  '/design/ui/cards': 'Header / content / footer permutations + loading state.',
  '/design/ui/forms': 'Input, label, textarea, submit row, aria-invalid errors.',
  '/design/ui/badges': 'Badge variants plus credits / success / warning chips.',
  '/design/ui/feedback': 'Alert variants, Dialog, Sonner toasts (portaled).',
  '/design/ui/tabs': 'Three-panel tab group with mixed content.',
  '/design/ui/table': 'Header / body / footer, zebra rows, empty state.',
  '/design/ui/skeleton': 'Line / avatar / card-shape / paragraph loaders.',
  '/design/ui/tooltip': 'Tooltip on button / icon / disabled target (portaled).',
};

export default function UiGalleryIndex() {
  return (
    <>
      <header className="flex flex-col gap-2">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.24em] uppercase">
          Production gallery
        </span>
        <h1 className="text-foreground text-3xl leading-tight font-semibold tracking-tight">
          Real primitives, real tokens.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Every page renders shipped shadcn components against the Graphite tokens from{' '}
          <code className="font-mono text-xs">apps/web/src/app/globals.css</code>. Side-by-side
          light and dark previews. For palette exploration, see{' '}
          <Link href="/design" className="text-foreground underline underline-offset-2">
            /design
          </Link>
          .
        </p>
      </header>

      <section aria-labelledby="index-heading" className="flex flex-col gap-4">
        <h2 id="index-heading" className="sr-only">
          Component pages
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CARDS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="border-border bg-card hover:border-primary/60 text-card-foreground flex flex-col gap-3 rounded-xl border p-4 transition-colors"
              >
                <span className="bg-accent text-foreground flex h-9 w-9 items-center justify-center rounded-md">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-foreground text-sm font-semibold">{item.label}</span>
                  <span className="text-muted-foreground text-xs">{BLURBS[item.href] ?? ''}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="notes-heading" className="flex flex-col gap-3">
        <h2 id="notes-heading" className="text-foreground text-sm font-semibold">
          How previews are scoped
        </h2>
        <div className="text-muted-foreground flex flex-col gap-2 text-xs leading-relaxed">
          <p>
            The left pane of each preview carries a <code className="font-mono">.light</code>{' '}
            wrapper; the right carries <code className="font-mono">.dark</code>. Custom properties
            cascade from those scopes, so previews stay deterministic regardless of your OS theme or
            the <code className="font-mono">next-themes</code> toggle.
          </p>
          <p>
            Portaled primitives — Dialog content, Tooltip content, Sonner toasts — render into{' '}
            <code className="font-mono">document.body</code>, outside the scoped wrappers, so their
            pages show a single preview that tracks the live app theme.
          </p>
        </div>
      </section>
    </>
  );
}
