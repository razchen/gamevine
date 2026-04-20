import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Design · Gamevine',
  description: 'Internal design surfaces. Not linked from production routes.',
  robots: { index: false, follow: false },
};

/**
 * Outer gate for the entire `/design/*` tree.
 *
 * Two sibling route groups live underneath:
 *   - `(sandbox)`  — palette / font / density scratchpad using `--color-gv-*`
 *                    tokens. Owns its own shell (ThemeSwitcher, DesignNav,
 *                    gv-sandbox-root wrapper, sandbox.css).
 *   - `ui`         — production-token component gallery. Renders real shadcn
 *                    primitives against Graphite tokens from `globals.css`.
 *
 * This outer layout intentionally does NOT render any chrome so each sibling
 * can own its own layout without nesting theirs inside an unrelated wrapper.
 */
export default function DesignLayout({ children }: { children: ReactNode }) {
  if (process.env.NEXT_PUBLIC_DESIGN_SANDBOX !== '1') {
    notFound();
  }
  return children;
}
