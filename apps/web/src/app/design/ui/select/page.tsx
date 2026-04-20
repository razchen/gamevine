'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ComponentExample } from '../_components/component-example';

export default function SelectPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Select</h1>
        <p className="text-muted-foreground text-sm">
          Single-select with grouped items, labels, and two trigger sizes. Content is portaled.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Default size"
          description="Default 32px trigger. Aligns with default-size Button."
          unportaled={false}
        >
          <BasicSelect />
        </ComponentExample>

        <ComponentExample
          title="Small size"
          description="28px trigger. Pairs with `size='sm'` buttons in toolbars."
          unportaled={false}
        >
          <SmallSelect />
        </ComponentExample>

        <ComponentExample
          title="Grouped items"
          description="Labeled groups, a separator, and long lists that scroll."
          unportaled={false}
        >
          <GroupedSelect />
        </ComponentExample>

        <ComponentExample
          title="Disabled + invalid"
          description="Trigger states from aria-disabled and aria-invalid."
          unportaled={false}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Select disabled>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Disabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Alpha</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-44" aria-invalid="true">
                <SelectValue placeholder="Choose one" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Alpha</SelectItem>
                <SelectItem value="b">Bravo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ComponentExample>
      </div>
    </>
  );
}

function BasicSelect() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="region">Region</Label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id="region" className="w-52">
          <SelectValue placeholder="Pick a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="na">North America</SelectItem>
          <SelectItem value="eu">Europe</SelectItem>
          <SelectItem value="apac">Asia Pacific</SelectItem>
          <SelectItem value="latam">Latin America</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function SmallSelect() {
  const [value, setValue] = useState<string | null>('10');
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger size="sm" className="w-20">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {['10', '25', '50', '100'].map((n) => (
          <SelectItem key={n} value={n}>
            {n}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function GroupedSelect() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Pick a game" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Published</SelectLabel>
          <SelectItem value="mirror-spiral">Mirror Spiral</SelectItem>
          <SelectItem value="harbor-run">Harbor Run</SelectItem>
          <SelectItem value="dusk-ember">Dusk Ember</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Drafts</SelectLabel>
          <SelectItem value="wip-1">Untitled draft 1</SelectItem>
          <SelectItem value="wip-2">Untitled draft 2</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
