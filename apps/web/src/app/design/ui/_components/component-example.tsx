import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Side-by-side light/dark preview.
 *
 * How the scoping works:
 *   - Left pane wraps children in `.light` → forces light-mode Graphite tokens
 *     (globals.css aliases `.light` to `:root`, so `--background`, `--primary`,
 *     etc. resolve to their light values inside this subtree regardless of
 *     what `<html>` looks like right now).
 *   - Right pane wraps children in `.dark` → triggers the dark overrides in
 *     globals.css via `@custom-variant dark (&:is(.dark *))`.
 *
 * `unportaled` opt-out:
 *   Some primitives (Dialog, Tooltip content, Sonner toasts) portal their
 *   visible DOM to `document.body`, which sits OUTSIDE the scoped wrappers
 *   above — so side-by-side would show the live app theme in both "panes".
 *   Pass `unportaled={false}` to render a single, full-width preview instead,
 *   with a note that makes the tradeoff explicit.
 *
 * Children are rendered twice (once per pane), so stateful examples get two
 * independent React instances. Deliberate and documented — consumers can
 * opt out by passing a memoised static element if they need a single source
 * of truth.
 */
export type ComponentExampleProps = {
  title: string;
  description?: string;
  /**
   * Set to `false` for components whose visible output portals to
   * `document.body` (Dialog, Tooltip content, Sonner). They'll render in a
   * single pane that tracks the live app theme.
   */
  unportaled?: boolean;
  className?: string;
  children: ReactNode;
};

export function ComponentExample({
  title,
  description,
  unportaled = true,
  className,
  children,
}: ComponentExampleProps) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <header className="flex flex-col gap-0.5">
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        {description ? <p className="text-muted-foreground text-xs">{description}</p> : null}
      </header>

      {unportaled ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <PreviewPane label="Light" tone="light">
            {children}
          </PreviewPane>
          <PreviewPane label="Dark" tone="dark">
            {children}
          </PreviewPane>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <PreviewPane label="Live theme" tone="live">
            {children}
          </PreviewPane>
          <p className="text-muted-foreground text-[11px]">
            Portaled to <code className="font-mono">document.body</code>, so it always renders in
            the live app theme. Use the system toggle to swap.
          </p>
        </div>
      )}
    </section>
  );
}

function PreviewPane({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'light' | 'dark' | 'live';
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        aria-hidden="true"
        className="text-muted-foreground pl-1 text-[10px] font-medium tracking-[0.14em] uppercase"
      >
        {label}
      </span>
      <div
        role="group"
        aria-label={`${label} preview`}
        className={cn(
          'border-border/70 bg-background text-foreground flex min-h-24 flex-wrap items-center gap-3 rounded-xl border p-5',
          tone === 'light' && 'light',
          tone === 'dark' && 'dark',
        )}
      >
        {children}
      </div>
    </div>
  );
}
