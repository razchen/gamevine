'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ComponentExample } from '../_components/component-example';

const PERMS = [
  { id: 'read', label: 'Read' },
  { id: 'write', label: 'Write' },
  { id: 'admin', label: 'Admin' },
] as const;

export default function CheckboxPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Checkbox</h1>
        <p className="text-muted-foreground text-sm">
          Multi-select primitive. Prefer Switch when the change takes effect immediately; use
          Checkbox inside forms and lists.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample title="States" description="Unchecked · checked · indeterminate.">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-muted-foreground text-xs">Unchecked</span>
              <Checkbox />
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-muted-foreground text-xs">Checked</span>
              <Checkbox defaultChecked />
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-muted-foreground text-xs">Indeterminate</span>
              <Checkbox indeterminate />
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-muted-foreground text-xs">Disabled</span>
              <Checkbox disabled defaultChecked />
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-muted-foreground text-xs">Invalid</span>
              <Checkbox aria-invalid="true" />
            </div>
          </div>
        </ComponentExample>

        <ComponentExample
          title="With label"
          description="Label wraps the checkbox and its caption for a clickable target."
        >
          <label className="flex items-center gap-2 text-sm">
            <Checkbox id="terms" defaultChecked />
            <Label htmlFor="terms">I agree to the terms of service</Label>
          </label>
        </ComponentExample>

        <ComponentExample
          title="Group with parent"
          description="Parent in indeterminate state when some, but not all, children are checked."
        >
          <PermissionTree />
        </ComponentExample>
      </div>
    </>
  );
}

function PermissionTree() {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    read: true,
    write: false,
    admin: false,
  });

  const values = Object.values(checked);
  const allChecked = values.every(Boolean);
  const noneChecked = values.every((v) => !v);
  const parentIndeterminate = !allChecked && !noneChecked;

  return (
    <div className="border-border flex w-72 flex-col gap-2 rounded-lg border p-3">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Checkbox
          checked={allChecked}
          indeterminate={parentIndeterminate}
          onCheckedChange={(next) => {
            setChecked({ read: next, write: next, admin: next });
          }}
        />
        Select all
      </label>
      <div className="border-border ml-6 flex flex-col gap-1.5 border-l pl-3">
        {PERMS.map((perm) => (
          <label key={perm.id} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={checked[perm.id]}
              onCheckedChange={(next) => setChecked((prev) => ({ ...prev, [perm.id]: next }))}
            />
            {perm.label}
          </label>
        ))}
      </div>
    </div>
  );
}
