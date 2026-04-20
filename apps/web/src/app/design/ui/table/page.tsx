import { Badge } from '@/components/ui/badge';
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
import { ComponentExample } from '../_components/component-example';

type Release = {
  title: string;
  status: 'funded' | 'queued' | 'shipped';
  credits: number;
};

const RELEASES: Release[] = [
  { title: 'Daily starter quest', status: 'funded', credits: 3200 },
  { title: 'Ranked leaderboards', status: 'queued', credits: 1800 },
  { title: 'Spectator mode', status: 'shipped', credits: 4600 },
  { title: 'Replay viewer', status: 'queued', credits: 1200 },
];

const TOTAL = RELEASES.reduce((sum, r) => sum + r.credits, 0);

export default function TablePage() {
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Table</h1>
        <p className="text-muted-foreground text-sm">
          Simple data tables. Zebra rows come from the row hover state; status column uses the
          --success and --warning tokens.
        </p>
      </header>

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
                      <StatusBadge status={release.status} />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {release.credits.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right font-mono">{TOTAL.toLocaleString()}</TableCell>
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

function StatusBadge({ status }: { status: Release['status'] }) {
  if (status === 'funded') {
    return (
      <span className="bg-success text-success-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium">
        Funded
      </span>
    );
  }
  if (status === 'shipped') {
    return <Badge variant="secondary">Shipped</Badge>;
  }
  return (
    <span className="bg-warning text-warning-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium">
      Queued
    </span>
  );
}
