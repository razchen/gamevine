import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Long-form text container. Applies `@tailwindcss/typography`'s `prose`
 * styles plus the local `prose-gv` modifier (defined in `globals.css`)
 * which retints links, code, blockquotes, and bullets to product tokens
 * (`--primary`, `--muted-foreground`, `--border`) instead of the plugin's
 * slate/zinc defaults.
 *
 * Pair with `dark:prose-invert` for dark-mode body text — that's already
 * wired into the className below.
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
      className={cn('prose prose-gv dark:prose-invert max-w-none', SIZE_CLASSES[size], className)}
    >
      {children}
    </div>
  );
}
