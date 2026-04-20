'use client';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Light / dark / system toggle backed by `next-themes`.
 *
 * The trigger icon swap is handled by CSS (`.dark` class on `<html>`),
 * not by a post-mount effect — SSR and first client render emit the
 * same markup, so there's no hydration flash and no setState-in-effect.
 *
 * `theme` is `undefined` during SSR; default the radio group to
 * `system` so the dropdown renders the right option when opened on the
 * client.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Toggle theme">
            <SunIcon className="block dark:hidden" />
            <MoonIcon className="hidden dark:block" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuRadioGroup
          value={theme ?? 'system'}
          onValueChange={(value) => {
            setTheme(value);
          }}
        >
          <DropdownMenuRadioItem value="light">
            <SunIcon data-icon="inline-start" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonIcon data-icon="inline-start" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <MonitorIcon data-icon="inline-start" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
