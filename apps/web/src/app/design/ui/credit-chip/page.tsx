import { CreditChip, PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function CreditChipGalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Composites"
        title="Credit chip"
        description="The one true way to render a credits value. Uses the --credits token so every surface stays in sync."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample title="Sizes" description="sm · md (default) · lg.">
          <CreditChip value={120} size="sm" />
          <CreditChip value={1200} size="md" />
          <CreditChip value={12000} size="lg" />
        </ComponentExample>

        <ComponentExample
          title="Tones"
          description="`solid` for emphasis, `soft` for inline/list usage."
        >
          <CreditChip value={3200} tone="solid" />
          <CreditChip value={3200} tone="soft" />
        </ComponentExample>

        <ComponentExample
          title="Signed deltas"
          description="Prefixes + / − so the chip doubles as a trend indicator."
        >
          <CreditChip value={1200} signed tone="soft" suffix={null} />
          <CreditChip value={0} signed tone="soft" suffix={null} />
          <CreditChip value={-420} signed tone="soft" suffix={null} />
        </ComponentExample>

        <ComponentExample
          title="No icon / no suffix"
          description="For dense tables where the column header already says 'credits'."
        >
          <CreditChip value={4600} hideIcon suffix={null} />
          <CreditChip value={4600} hideIcon />
          <CreditChip value={4600} suffix={null} />
        </ComponentExample>

        <ComponentExample
          title="Inline in text"
          description="Small size flows alongside copy without breaking the baseline."
        >
          <p className="text-foreground text-sm leading-relaxed">
            The community pledged <CreditChip value={8400} size="sm" tone="soft" /> toward this
            release, <CreditChip value={1200} size="sm" signed tone="soft" /> more than last week.
          </p>
        </ComponentExample>
      </div>
    </>
  );
}
