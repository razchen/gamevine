import type { Route } from 'next';
import {
  AlertTriangleIcon,
  CreditCardIcon,
  FormInputIcon,
  HomeIcon,
  LayersIcon,
  MousePointerClickIcon,
  SquareIcon,
  TableIcon,
  TagIcon,
  WandSparklesIcon,
  type LucideIcon,
} from 'lucide-react';

export type UiNavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
};

/**
 * Shared between the client-side `<UiNav />` component and the server-side
 * gallery index page. Lives in a plain module (no `'use client'`) so Server
 * Components can treat `UI_NAV` as a real array — importing plain data from
 * a `'use client'` file would give them an opaque client reference instead.
 */
export const UI_NAV: UiNavItem[] = [
  { href: '/design/ui', label: 'Overview', icon: HomeIcon },
  { href: '/design/ui/buttons', label: 'Buttons', icon: MousePointerClickIcon },
  { href: '/design/ui/cards', label: 'Cards', icon: CreditCardIcon },
  { href: '/design/ui/forms', label: 'Forms', icon: FormInputIcon },
  { href: '/design/ui/badges', label: 'Badges', icon: TagIcon },
  { href: '/design/ui/feedback', label: 'Feedback', icon: AlertTriangleIcon },
  { href: '/design/ui/tabs', label: 'Tabs', icon: LayersIcon },
  { href: '/design/ui/table', label: 'Table', icon: TableIcon },
  { href: '/design/ui/skeleton', label: 'Skeleton', icon: SquareIcon },
  { href: '/design/ui/tooltip', label: 'Tooltip', icon: WandSparklesIcon },
];
