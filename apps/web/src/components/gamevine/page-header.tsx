import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Page-level header used at the top of `/design/ui/*` gallery pages and
 * (ultimately) product pages. Replaces the ad-hoc `<header><h1>…</h1><p>…</p></header>`
 * blocks scattered through the app so tone, spacing, and the eyebrow slot stay
 * coherent across the product.
 *
 * Server-component safe: no client hooks, no event handlers. Interactive
 * elements belong in `actions`.
 */
export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /**
   * Small label above the title — useful for section context ("Primitives",
   * "Composites", "Dashboard"). Keep it short; renders uppercased.
   */
  eyebrow?: ReactNode;
  /**
   * Right-side slot for buttons, badges, etc. Rendered inline next to the
   * title block on >=sm screens and stacked below on narrow viewports.
   */
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, description, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow ? (
          <span className="text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>
      {actions ? (
        <div
          data-slot="page-header-actions"
          className="flex flex-wrap items-center gap-2 sm:shrink-0"
        >
          {actions}
        </div>
      ) : null}
    </header>
  );
}
