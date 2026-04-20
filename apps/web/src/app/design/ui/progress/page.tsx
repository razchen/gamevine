import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/components/ui/progress';
import { PageHeader } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function ProgressPage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Progress"
        description="Determinate progress. Indeterminate loading should use the Skeleton primitive instead."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Default"
          description="Track renders auto children — we skip custom content here."
        >
          <div className="flex w-full flex-col gap-4">
            {[10, 40, 72, 100].map((v) => (
              <Progress key={v} value={v} aria-label={`${v}% complete`} />
            ))}
          </div>
        </ComponentExample>

        <ComponentExample
          title="With label and value"
          description="Pair a label with a tabular-num value for dashboards."
        >
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Progress value={42}>
              <ProgressLabel>Funding</ProgressLabel>
              <ProgressValue />
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
            <Progress value={86}>
              <ProgressLabel>Review completeness</ProgressLabel>
              <ProgressValue />
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
          </div>
        </ComponentExample>

        <ComponentExample
          title="Success tone"
          description="Override indicator colour via className for semantic meaning."
        >
          <div className="flex w-full flex-col gap-3">
            <Progress value={100}>
              <ProgressLabel>Complete</ProgressLabel>
              <ProgressValue />
              <ProgressTrack>
                <ProgressIndicator className="bg-success" />
              </ProgressTrack>
            </Progress>
            <Progress value={30}>
              <ProgressLabel>Low funds</ProgressLabel>
              <ProgressValue />
              <ProgressTrack>
                <ProgressIndicator className="bg-warning" />
              </ProgressTrack>
            </Progress>
          </div>
        </ComponentExample>
      </div>
    </>
  );
}
