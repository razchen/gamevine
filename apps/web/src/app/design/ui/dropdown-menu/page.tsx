'use client';

import { useState } from 'react';
import { CopyIcon, EditIcon, MoreHorizontalIcon, SettingsIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ComponentExample } from '../_components/component-example';

export default function DropdownMenuPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Dropdown menu</h1>
        <p className="text-muted-foreground text-sm">
          Command menu + row actions. Portaled to <code className="font-mono">document.body</code>,
          so previews are rendered in the live theme only.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Items, labels, separator"
          description="Grouped actions with a destructive variant at the bottom."
          unportaled={false}
        >
          <BasicMenu />
        </ComponentExample>

        <ComponentExample
          title="Checkboxes"
          description="Multi-select state — e.g. column visibility, filter chips."
          unportaled={false}
        >
          <CheckboxMenu />
        </ComponentExample>

        <ComponentExample
          title="Radio group"
          description="Single-select state — e.g. sort order, density choice."
          unportaled={false}
        >
          <RadioMenu />
        </ComponentExample>

        <ComponentExample
          title="Submenu"
          description="Nested actions. Base-UI positions automatically."
          unportaled={false}
        >
          <SubmenuMenu />
        </ComponentExample>
      </div>
    </>
  );
}

function BasicMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Row actions">
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <EditIcon />
            Edit
            <DropdownMenuShortcut>E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Duplicate
            <DropdownMenuShortcut>D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <TrashIcon />
          Delete
          <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CheckboxMenu() {
  const [cols, setCols] = useState({ title: true, created: true, owner: false });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Columns</Button>} />
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={cols.title}
          onCheckedChange={(v) => setCols((c) => ({ ...c, title: v === true }))}
        >
          Title
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={cols.created}
          onCheckedChange={(v) => setCols((c) => ({ ...c, created: v === true }))}
        >
          Created
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={cols.owner}
          onCheckedChange={(v) => setCols((c) => ({ ...c, owner: v === true }))}
        >
          Owner
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RadioMenu() {
  const [sort, setSort] = useState('newest');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Sort: {label(sort)}</Button>} />
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="alpha">Alphabetical</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SubmenuMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            <SettingsIcon data-icon="inline-start" />
            Settings
          </Button>
        }
      />
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Appearance</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Light</DropdownMenuItem>
            <DropdownMenuItem>Dark</DropdownMenuItem>
            <DropdownMenuItem>System</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
