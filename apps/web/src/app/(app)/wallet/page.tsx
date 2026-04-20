import { CreditChip, PageHeader } from '@/components/gamevine';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { LedgerTable } from './_components/ledger-table';
import {
  CURRENT_BALANCE,
  GRANT_SPENT,
  GRANT_TOTAL,
  HELD_BALANCE,
  MOCK_LEDGER,
  SUBSCRIPTION_TIER,
  TOPUP_PACKS,
} from './_data';

export default function WalletPage() {
  const grantPct = Math.round((GRANT_SPENT / GRANT_TOTAL) * 100);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <PageHeader
        title="Wallet"
        description="Balance, held pledges, and your append-only credit ledger."
      />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
                  Available balance
                </span>
                <CreditChip value={CURRENT_BALANCE} size="lg" tone="solid" suffix={null} />
                <span className="text-muted-foreground text-xs">
                  Held on pledges ·{' '}
                  <CreditChip value={HELD_BALANCE} size="sm" tone="soft" suffix={null} />
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary">{SUBSCRIPTION_TIER}</Badge>
                <span className="text-muted-foreground text-xs">Renews Apr 30</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">Monthly grant spent</span>
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  <CreditChip value={GRANT_SPENT} size="sm" tone="soft" suffix={null} />
                  <span>of</span>
                  <CreditChip value={GRANT_TOTAL} size="sm" tone="soft" suffix={null} />
                </span>
              </div>
              <Progress value={grantPct} aria-label={`${grantPct.toString()}% of grant spent`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3">
            <span className="text-foreground text-sm font-semibold">Top up</span>
            <p className="text-muted-foreground text-xs">
              One-time credit boost. Payments coming soon.
            </p>
            <div className="flex flex-col gap-2">
              {TOPUP_PACKS.map((pack) => (
                <Button
                  key={pack.key}
                  variant="outline"
                  size="sm"
                  disabled
                  className="justify-between"
                >
                  <span>
                    {pack.label} · {pack.price}
                  </span>
                  <CreditChip value={pack.credits} size="sm" tone="soft" suffix={null} />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="ledger-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 id="ledger-heading" className="text-foreground text-lg font-semibold">
            Ledger
          </h2>
          <span className="text-muted-foreground text-xs">
            Append-only — entries are never edited
          </span>
        </div>
        <LedgerTable data={MOCK_LEDGER} />
      </section>
    </div>
  );
}
