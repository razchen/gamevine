'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

const PLANS = [
  { id: 'starter', title: 'Starter', desc: 'Two games, limited invites.' },
  { id: 'pro', title: 'Pro', desc: 'Unlimited games + analytics.' },
  { id: 'studio', title: 'Studio', desc: 'Everything in Pro + team seats.' },
] as const;

export default function RadioGroupPage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Radio group"
        description="Single-select where options benefit from being visible. Prefer Select when there are more than ~5 options."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample title="Vertical" description="Default orientation.">
          <VerticalRadio />
        </ComponentExample>

        <ComponentExample
          title="Horizontal"
          description="Override with a grid — common for 2–3 short options."
        >
          <HorizontalRadio />
        </ComponentExample>

        <ComponentExample
          title="Cards"
          description="Each option wraps itself in a card for richer detail."
        >
          <CardRadio />
        </ComponentExample>

        <ComponentExample title="Invalid" description="aria-invalid on the group applies to items.">
          <RadioGroup defaultValue="a" aria-invalid="true">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="a" /> Option A
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="b" /> Option B
            </label>
          </RadioGroup>
        </ComponentExample>
      </div>
    </>
  );
}

function VerticalRadio() {
  const [value, setValue] = useState('pro');
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      {PLANS.map((plan) => (
        <label key={plan.id} className="flex items-center gap-2 text-sm">
          <RadioGroupItem value={plan.id} />
          {plan.title}
        </label>
      ))}
    </RadioGroup>
  );
}

function HorizontalRadio() {
  const [value, setValue] = useState('month');
  return (
    <RadioGroup value={value} onValueChange={setValue} className="auto-cols-max grid-flow-col">
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem value="month" />
        Monthly
      </label>
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem value="year" />
        Annual
      </label>
    </RadioGroup>
  );
}

function CardRadio() {
  const [value, setValue] = useState('pro');
  return (
    <RadioGroup value={value} onValueChange={setValue} className="gap-2">
      {PLANS.map((plan) => (
        <label
          key={plan.id}
          className="border-border hover:border-primary/60 has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/5 flex items-start gap-3 rounded-lg border p-3 transition-colors"
        >
          <RadioGroupItem value={plan.id} className="mt-0.5" />
          <div className="flex flex-col">
            <Label className="text-sm">{plan.title}</Label>
            <span className="text-muted-foreground text-xs">{plan.desc}</span>
          </div>
        </label>
      ))}
    </RadioGroup>
  );
}
