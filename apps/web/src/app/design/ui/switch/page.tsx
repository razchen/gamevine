'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ComponentExample } from '../_components/component-example';

export default function SwitchPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Switch</h1>
        <p className="text-muted-foreground text-sm">
          On / off toggle. Preferred over Checkbox for settings where the new state takes effect
          immediately (notifications, visibility, feature flags).
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample title="States" description="Unchecked, checked, disabled.">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-muted-foreground text-xs">Off</span>
              <Switch />
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-muted-foreground text-xs">On</span>
              <Switch defaultChecked />
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-muted-foreground text-xs">Disabled</span>
              <Switch disabled />
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-muted-foreground text-xs">Disabled on</span>
              <Switch disabled defaultChecked />
            </div>
          </div>
        </ComponentExample>

        <ComponentExample title="Sizes" description="sm · default.">
          <Switch size="sm" defaultChecked />
          <Switch defaultChecked />
        </ComponentExample>

        <ComponentExample title="Invalid state" description="aria-invalid surfaces a red ring.">
          <Switch aria-invalid="true" />
        </ComponentExample>

        <ComponentExample
          title="Controlled with label"
          description="Label + switch row — the canonical settings pattern."
        >
          <LabeledSwitch />
        </ComponentExample>
      </div>
    </>
  );
}

function LabeledSwitch() {
  const [checked, setChecked] = useState(true);
  return (
    <div className="border-border flex w-80 max-w-full items-center justify-between gap-6 rounded-lg border p-3">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor="notif">Email notifications</Label>
        <span className="text-muted-foreground text-xs">
          Send an email when one of your games is funded.
        </span>
      </div>
      <Switch id="notif" checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}
