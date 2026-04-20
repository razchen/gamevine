import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreditChip, PageHeader, StatusBadge, type StatusValue } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

type Release = {
  title: string;
  status: StatusValue;
  credits: number;
};

const RELEASES: Release[] = [
  { title: 'Daily starter quest', status: 'funded', credits: 3200 },
  { title: 'Ranked leaderboards', status: 'queued', credits: 1800 },
  { title: 'Spectator mode', status: 'released', credits: 4600 },
  { title: 'Replay viewer', status: 'queued', credits: 1200 },
];

const TOTAL = RELEASES.reduce((sum, r) => sum + r.credits, 0);

export default function TablePage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Table"
        description="Simple data tables. Zebra rows come from the row hover state; the status column uses the StatusBadge composite and the credits column uses CreditChip so both surfaces stay synced with the shared tokens."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample title="With header, body, footer" description="A typical release roster.">
          <div className="w-full max-w-xl">
            <Table>
              <TableCaption>Releases this cycle.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Release</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RELEASES.map((release) => (
                  <TableRow key={release.title}>
                    <TableCell className="font-medium">{release.title}</TableCell>
                    <TableCell>
                      <StatusBadge status={release.status} size="sm" />
                    </TableCell>
                    <TableCell className="text-right">
                      <CreditChip value={release.credits} size="sm" tone="soft" suffix={null} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">
                    <CreditChip value={TOTAL} size="sm" hideIcon suffix={null} />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </ComponentExample>

        <ComponentExample title="Empty state" description="Ruleset when no rows match.">
          <div className="w-full max-w-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Release</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground py-6 text-center">
                    No releases yet. The inbox starts empty.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </ComponentExample>
      </div>
    </>
  );
}
