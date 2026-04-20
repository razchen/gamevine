'use client';

import { useState } from 'react';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ComponentExample } from '../_components/component-example';

export default function TogglePage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Toggle</h1>
        <p className="text-muted-foreground text-sm">
          Pressable button with a sticky on/off state. Use a single Toggle for boolean affordances
          (bold / italic / pin). Use ToggleGroup when exactly one of several options should be
          selected (alignment, view mode).
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample title="Variants" description="Default and outline.">
          <Toggle aria-label="Bold">
            <BoldIcon />
          </Toggle>
          <Toggle variant="outline" aria-label="Bold">
            <BoldIcon />
          </Toggle>
          <Toggle defaultPressed aria-label="Bold pressed">
            <BoldIcon />
          </Toggle>
          <Toggle variant="outline" defaultPressed aria-label="Bold pressed outline">
            <BoldIcon />
          </Toggle>
        </ComponentExample>

        <ComponentExample title="Sizes" description="sm · default · lg.">
          <Toggle size="sm" aria-label="Italic sm">
            <ItalicIcon />
          </Toggle>
          <Toggle aria-label="Italic default">
            <ItalicIcon />
          </Toggle>
          <Toggle size="lg" aria-label="Italic lg">
            <ItalicIcon />
          </Toggle>
        </ComponentExample>

        <ComponentExample
          title="With text"
          description="Toggles aren't icon-only — label for clarity."
        >
          <Toggle variant="outline" aria-label="Only mine">
            Only mine
          </Toggle>
          <Toggle aria-label="Sort by new" defaultPressed>
            New first
          </Toggle>
        </ComponentExample>

        <ComponentExample
          title="Toggle group (single)"
          description="Exactly one selected at a time — the text alignment pattern."
        >
          <AlignmentGroup />
        </ComponentExample>

        <ComponentExample
          title="Toggle group (multiple)"
          description="Any number selected — formatting pattern."
        >
          <FormatGroup />
        </ComponentExample>
      </div>
    </>
  );
}

function AlignmentGroup() {
  const [value, setValue] = useState<string[]>(['left']);
  return (
    <ToggleGroup value={value} onValueChange={setValue} variant="outline">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function FormatGroup() {
  const [value, setValue] = useState<string[]>(['bold']);
  return (
    <ToggleGroup multiple value={value} onValueChange={setValue} variant="outline">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
