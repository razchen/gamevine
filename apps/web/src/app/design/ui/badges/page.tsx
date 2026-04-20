import { CheckIcon, CoinsIcon, TriangleAlertIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ComponentExample } from '../_components/component-example';

const VARIANTS = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const;

export default function BadgesPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Badges & chips</h1>
        <p className="text-muted-foreground text-sm">
          All Badge variants plus raw credits / success / warning chips that exercise the
          product-specific tokens.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample title="Badge variants" description="Six variants. Same pill shape.">
          {VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {label(variant)}
            </Badge>
          ))}
        </ComponentExample>

        <ComponentExample title="With icons" description="Leading icon inside a default badge.">
          <Badge>
            <CheckIcon />
            Verified
          </Badge>
          <Badge variant="outline">
            <TriangleAlertIcon />
            Review required
          </Badge>
          <Badge variant="secondary">
            <CoinsIcon />
            12,400
          </Badge>
        </ComponentExample>

        <ComponentExample
          title="Product chips"
          description="Raw Tailwind utilities for --credits / --success / --warning. Validates the product-specific token families."
        >
          <span className="bg-credits text-credits-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium">
            <CoinsIcon className="size-3" />
            12,400 credits
          </span>
          <span className="bg-success text-success-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium">
            <CheckIcon className="size-3" />
            Funded
          </span>
          <span className="bg-warning text-warning-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium">
            <TriangleAlertIcon className="size-3" />
            SLA expiring
          </span>
        </ComponentExample>
      </div>
    </>
  );
}

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
