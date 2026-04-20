import Link from 'next/link';
import { UI_NAV, flatNavItems } from './_components/ui-nav-items';

export default function UiGalleryIndex() {
  const groups = UI_NAV.filter((group) => group.label !== 'Overview');
  const total = flatNavItems(groups).length;

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
          {total} pages render shipped shadcn components against the Graphite tokens from{' '}
          <code className="font-mono text-xs">apps/web/src/app/globals.css</code>. Side-by-side
          light and dark previews. For palette exploration, see{' '}
          <Link href="/design" className="text-foreground underline underline-offset-2">
            /design
          </Link>
          .
        </p>
      </header>

      {groups.map((group) => (
        <section
          key={group.label}
          aria-labelledby={`group-${group.label}`}
          className="flex flex-col gap-3"
        >
          <h2
            id={`group-${group.label}`}
            className="text-muted-foreground text-[11px] font-semibold tracking-[0.2em] uppercase"
          >
            {group.label}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => {
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
                    <span className="text-muted-foreground text-xs">{item.blurb ?? ''}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

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
            Portaled primitives — Dialog content, Tooltip content, Popover content, Dropdown
            content, Select content, Sonner toasts — render into{' '}
            <code className="font-mono">document.body</code>, outside the scoped wrappers, so their
            pages show a single preview that tracks the live app theme.
          </p>
        </div>
      </section>
    </>
  );
}
