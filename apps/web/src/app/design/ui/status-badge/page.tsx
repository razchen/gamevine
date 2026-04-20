import { PageHeader, STATUS_VALUES, StatusBadge } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

export default function StatusBadgeGalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Composites"
        title="Status badge"
        description="Placeholder vocabulary for release-style artifacts. Will be replaced with the real state machine from packages/shared once the product flow firms up — until then, every surface uses this component."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Vocabulary"
          description="All six placeholder statuses at default size."
        >
          {STATUS_VALUES.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </ComponentExample>

        <ComponentExample title="Small size" description="For dense tables and inline rows.">
          {STATUS_VALUES.map((status) => (
            <StatusBadge key={status} status={status} size="sm" />
          ))}
        </ComponentExample>

        <ComponentExample title="Without icon" description="When the label alone is enough.">
          {STATUS_VALUES.map((status) => (
            <StatusBadge key={status} status={status} hideIcon />
          ))}
        </ComponentExample>

        <ComponentExample
          title="Inside a table row"
          description="Typical usage — a status cell that doesn't fight the row."
        >
          <div className="border-border/70 bg-card text-card-foreground w-full overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Update</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-border/60 border-t">
                  <td className="px-3 py-2">Ranked leaderboards</td>
                  <td className="px-3 py-2">
                    <StatusBadge status="queued" size="sm" />
                  </td>
                </tr>
                <tr className="border-border/60 border-t">
                  <td className="px-3 py-2">Spectator mode</td>
                  <td className="px-3 py-2">
                    <StatusBadge status="funded" size="sm" />
                  </td>
                </tr>
                <tr className="border-border/60 border-t">
                  <td className="px-3 py-2">Replay viewer</td>
                  <td className="px-3 py-2">
                    <StatusBadge status="released" size="sm" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ComponentExample>
      </div>
    </>
  );
}
