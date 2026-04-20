'use client';

import { SettingsIcon, SlidersHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function PopoverPage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Popover"
        description="Anchored content for settings, filters, peeks. Portaled, so previews render in the live theme only."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Simple text"
          description="Title + description. Pops below the trigger by default."
          unportaled={false}
        >
          <Popover>
            <PopoverTrigger render={<Button variant="outline">About this game</Button>} />
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Mirror Spiral</PopoverTitle>
                <PopoverDescription>
                  A two-player hand-drawn puzzler about symmetry and timing. Released 2026.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </ComponentExample>

        <ComponentExample
          title="With form controls"
          description="Popovers are content-agnostic — drop any focusable tree inside."
          unportaled={false}
        >
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline">
                  <SlidersHorizontalIcon data-icon="inline-start" />
                  Filters
                </Button>
              }
            />
            <PopoverContent className="w-80">
              <PopoverHeader>
                <PopoverTitle>Filter games</PopoverTitle>
                <PopoverDescription>Narrow the catalog.</PopoverDescription>
              </PopoverHeader>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="search">Title contains</Label>
                  <Input id="search" placeholder="Mirror, Harbor…" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-foreground text-xs font-medium">Status</span>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <label className="flex items-center gap-2">
                      <Checkbox defaultChecked />
                      Published
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox />
                      Draft
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox />
                      Archived
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button size="sm" variant="ghost">
                    Reset
                  </Button>
                  <Button size="sm">Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ComponentExample>

        <ComponentExample
          title="Side placement"
          description="`side` and `align` control anchoring. Auto-flips near viewport edges."
          unportaled={false}
        >
          <div className="flex flex-wrap items-center gap-3">
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
              <Popover key={side}>
                <PopoverTrigger
                  render={
                    <Button variant="outline" size="sm">
                      {side}
                    </Button>
                  }
                />
                <PopoverContent side={side} className="w-48">
                  <PopoverHeader>
                    <PopoverTitle>Anchored {side}</PopoverTitle>
                    <PopoverDescription>Flips if there isn&apos;t room.</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </ComponentExample>

        <ComponentExample
          title="Icon trigger"
          description="Small anchor point for toolbar-style controls."
          unportaled={false}
        >
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Preferences">
                  <SettingsIcon />
                </Button>
              }
            />
            <PopoverContent className="w-64">
              <PopoverHeader>
                <PopoverTitle>Preferences</PopoverTitle>
                <PopoverDescription>Scoped to this surface only.</PopoverDescription>
              </PopoverHeader>
              <div className="flex flex-col gap-2 text-sm">
                <label className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  Reduce motion
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox />
                  Compact density
                </label>
              </div>
            </PopoverContent>
          </Popover>
        </ComponentExample>
      </div>
    </>
  );
}
