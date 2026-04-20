import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Long-form text container. Applies `@tailwindcss/typography`'s `prose`
 * styles plus the local `prose-gv` modifier (defined in `globals.css`)
 * which routes every prose token through our shadcn CSS vars
 * (`--foreground`, `--muted-foreground`, `--border`, `--primary`,
 * `--muted`). Dark mode falls out of the cascade automatically — do NOT
 * also pair this with `dark:prose-invert`, that would override the
 * scoped tokens used by the side-by-side gallery panes.
 *
 * Server-component safe.
 */
export type ProseProps = {
  children: ReactNode;
  /** Override the prose size (`prose-sm`, `prose-lg`, etc.). */
  size?: 'sm' | 'base' | 'lg' | 'xl';
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<ProseProps['size']>, string> = {
  sm: 'prose-sm',
  base: '',
  lg: 'prose-lg',
  xl: 'prose-xl',
};

export function Prose({ children, size = 'base', className }: ProseProps) {
  return (
    <div
      data-slot="prose"
      className={cn('prose prose-gv max-w-none', SIZE_CLASSES[size], className)}
    >
      {children}
    </div>
  );
}
