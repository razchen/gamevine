import { ArrowRightIcon, DownloadIcon, Loader2Icon, SparklesIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComponentExample } from '../_components/component-example';

const VARIANTS = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const;
const SIZES = ['xs', 'sm', 'default', 'lg'] as const;
const ICON_SIZES = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const;

export default function ButtonsPage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Buttons</h1>
        <p className="text-muted-foreground text-sm">
          Six variants × four sizes × icon-only sizes × states. Icons are{' '}
          <code className="font-mono text-xs">lucide-react</code>.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <ComponentExample title="Variants" description="All six CTA styles at default size.">
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {label(variant)}
            </Button>
          ))}
        </ComponentExample>

        <ComponentExample title="Sizes" description="xs · sm · default · lg (non-icon).">
          {SIZES.map((size) => (
            <Button key={size} size={size}>
              {label(size)}
            </Button>
          ))}
        </ComponentExample>

        <ComponentExample
          title="Icon-only sizes"
          description="Square icon buttons. Every size matches the text-button heights."
        >
          {ICON_SIZES.map((size) => (
            <Button key={size} size={size} aria-label={label(size)}>
              <SparklesIcon />
            </Button>
          ))}
        </ComponentExample>

        <ComponentExample
          title="Leading & trailing icons"
          description="Use data-icon to hint side. Icons auto-size per button size."
        >
          <Button>
            <DownloadIcon data-icon="inline-start" />
            <span>Download</span>
          </Button>
          <Button variant="outline">
            <span>Continue</span>
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="destructive">
            <TrashIcon data-icon="inline-start" />
            <span>Delete</span>
          </Button>
        </ComponentExample>

        <ComponentExample title="States" description="Disabled, loading, aria-invalid.">
          <Button disabled>Disabled</Button>
          <Button disabled>
            <Loader2Icon data-icon="inline-start" className="animate-spin" />
            <span>Loading</span>
          </Button>
          <Button aria-invalid="true">Invalid</Button>
        </ComponentExample>
      </div>
    </>
  );
}

function label(value: string) {
  return value
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}
