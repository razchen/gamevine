import Link from 'next/link';
import { BellIcon, PlusIcon } from 'lucide-react';
import { APP_NAME } from '@gamevine/shared';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { CreditChip } from './credit-chip';
import { PlayerAvatar } from './player-avatar';
import { ThemeToggle } from './theme-toggle';

/**
 * Minimal signed-in app chrome. Left: wordmark. Center: primary nav.
 * Right: credits chip (→ /wallet), inbox bell, avatar menu.
 *
 * The avatar dropdown is the only genuinely interactive piece; everything
 * else is anchors + static buttons, so this stays a Server Component and
 * only the dropdown subtree hydrates.
 */
export type AppHeaderProps = {
  className?: string;
};

export function AppHeader({ className }: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={cn(
        'bg-background/80 border-border/70 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur',
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-6">
        <Link
          href="/browse"
          className="text-foreground hover:text-foreground/80 flex items-center gap-2 font-semibold tracking-tight"
        >
          <span
            aria-hidden="true"
            className="bg-primary text-primary-foreground inline-flex size-6 items-center justify-center rounded-md text-xs font-bold"
          >
            G
          </span>
          <span className="hidden sm:inline">{APP_NAME}</span>
        </Link>

        <nav aria-label="Primary" className="ml-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            className="text-foreground/70 hover:text-foreground"
            render={<Link href="/browse">Browse</Link>}
          />
          <Button
            variant="ghost"
            size="sm"
            disabled
            title="Creator tier required"
            className="text-foreground/50"
          >
            <PlusIcon data-icon="inline-start" />
            Create
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/wallet"
            aria-label="Wallet"
            className="focus-visible:ring-ring/50 rounded-full focus-visible:ring-2 focus-visible:outline-none"
          >
            <CreditChip value={1_847_500} tone="soft" size="sm" suffix={null} />
          </Link>

          <Button variant="ghost" size="icon-sm" aria-label="Inbox" disabled>
            <BellIcon />
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="Account menu"
                  className="focus-visible:ring-ring/50 rounded-full focus-visible:ring-2 focus-visible:outline-none"
                >
                  <PlayerAvatar name="Raz" size="sm" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Signed in as Raz</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>My games</DropdownMenuItem>
              <DropdownMenuItem disabled>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
