import type { Route } from 'next';
import {
  AlertTriangleIcon,
  CheckSquareIcon,
  CircleDotIcon,
  CircleUserIcon,
  CreditCardIcon,
  FormInputIcon,
  HomeIcon,
  LayersIcon,
  ListIcon,
  MenuIcon,
  MessageSquareIcon,
  MinusIcon,
  MousePointerClickIcon,
  SquareIcon,
  TableIcon,
  TagIcon,
  ToggleRightIcon,
  WandSparklesIcon,
  type LucideIcon,
} from 'lucide-react';

export type UiNavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  blurb?: string;
};

export type UiNavGroup = {
  label: string;
  items: UiNavItem[];
};

/**
 * Shared between the client-side `<UiNav />` and the server-side gallery
 * index page. Lives in a plain module (no `'use client'`) so Server
 * Components can treat the array as real data — importing plain data from a
 * `'use client'` file would give them an opaque client reference instead.
 */
export const UI_NAV: UiNavGroup[] = [
  {
    label: 'Overview',
    items: [{ href: '/design/ui', label: 'Overview', icon: HomeIcon }],
  },
  {
    label: 'Primitives',
    items: [
      {
        href: '/design/ui/buttons',
        label: 'Buttons',
        icon: MousePointerClickIcon,
        blurb: 'Every variant × size × state × lucide icon combination.',
      },
      {
        href: '/design/ui/cards',
        label: 'Cards',
        icon: CreditCardIcon,
        blurb: 'Header / content / footer permutations + loading state.',
      },
      {
        href: '/design/ui/forms',
        label: 'Forms',
        icon: FormInputIcon,
        blurb: 'Input, label, textarea, submit row, aria-invalid errors.',
      },
      {
        href: '/design/ui/badges',
        label: 'Badges',
        icon: TagIcon,
        blurb: 'Badge variants plus credits / success / warning chips.',
      },
      {
        href: '/design/ui/feedback',
        label: 'Feedback',
        icon: AlertTriangleIcon,
        blurb: 'Alert variants, Dialog, Sonner toasts (portaled).',
      },
      {
        href: '/design/ui/tabs',
        label: 'Tabs',
        icon: LayersIcon,
        blurb: 'Three-panel tab group with mixed content.',
      },
      {
        href: '/design/ui/table',
        label: 'Table',
        icon: TableIcon,
        blurb: 'Header / body / footer, zebra rows, empty state.',
      },
      {
        href: '/design/ui/skeleton',
        label: 'Skeleton',
        icon: SquareIcon,
        blurb: 'Line / avatar / card-shape / paragraph loaders.',
      },
      {
        href: '/design/ui/tooltip',
        label: 'Tooltip',
        icon: WandSparklesIcon,
        blurb: 'Tooltip on button / icon / disabled target (portaled).',
      },
      {
        href: '/design/ui/avatar',
        label: 'Avatar',
        icon: CircleUserIcon,
        blurb: 'Image, fallback, presence badge, avatar group.',
      },
      {
        href: '/design/ui/dropdown-menu',
        label: 'Dropdown menu',
        icon: MenuIcon,
        blurb: 'Items, labels, separators, checkboxes, radios, submenus.',
      },
      {
        href: '/design/ui/select',
        label: 'Select',
        icon: ListIcon,
        blurb: 'Single-select with grouped items and sizes.',
      },
      {
        href: '/design/ui/popover',
        label: 'Popover',
        icon: MessageSquareIcon,
        blurb: 'Anchored content (portaled) — settings, filters, peeks.',
      },
      {
        href: '/design/ui/switch',
        label: 'Switch',
        icon: ToggleRightIcon,
        blurb: 'On / off toggle, two sizes, invalid state.',
      },
      {
        href: '/design/ui/checkbox',
        label: 'Checkbox',
        icon: CheckSquareIcon,
        blurb: 'Checked, unchecked, indeterminate, invalid, disabled.',
      },
      {
        href: '/design/ui/radio-group',
        label: 'Radio group',
        icon: CircleDotIcon,
        blurb: 'Single-select with vertical and horizontal layouts.',
      },
      {
        href: '/design/ui/separator',
        label: 'Separator',
        icon: MinusIcon,
        blurb: 'Horizontal and vertical dividers.',
      },
    ],
  },
];

export function flatNavItems(groups: UiNavGroup[] = UI_NAV): UiNavItem[] {
  return groups.flatMap((group) => group.items);
}
