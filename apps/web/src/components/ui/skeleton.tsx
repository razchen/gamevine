import { cn } from '@/lib/utils';

/*
 * Skeleton intentionally uses `bg-muted-foreground/20` rather than
 * shadcn's default `bg-muted`. In Graphite's light mode `--muted` sits
 * at oklch(0.97 …) — only ~0.02L darker than `--background` (0.99) and
 * invisible on top of a pure-white card. Anchoring to muted-foreground
 * at 20% alpha keeps skeletons legible on any surface (background,
 * card, popover) in both themes, while staying subtle enough to read
 * as "loading" rather than "broken".
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-muted-foreground/20 animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
