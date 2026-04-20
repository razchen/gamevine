import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Friendly empty-state block for zero-data surfaces (empty tables, empty
 * lists, empty inboxes). Kept intentionally quiet — icon is muted, CTA is
 * optional, and the card itself uses a dashed border so it reads as a gap
 * rather than a real surface.
 *
 * Server-component safe; pass a `<Button />` as `action` for interactive
 * CTAs.
 */
export type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  /**
   * Icon slot — typically a lucide icon (`<SparklesIcon className="size-6" />`).
   * Sized + coloured by the parent; no need to repeat styles.
   */
  icon?: ReactNode;
  /**
   * Primary CTA — usually a single `<Button />`. For secondary links, stack
   * them under the button inside this slot.
   */
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'border-border/80 bg-muted/30 text-foreground flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center',
        className,
      )}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="text-muted-foreground bg-muted flex size-12 items-center justify-center rounded-full [&>svg]:size-6"
        >
          {icon}
        </div>
      ) : null}
      <div className="flex max-w-md flex-col gap-1">
        <p className="text-foreground text-sm font-medium">{title}</p>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
