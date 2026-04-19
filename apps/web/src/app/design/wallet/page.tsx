import { LedgerRow } from '../_components/ledger-row';
import { Badge, Credits, Progress } from '../_components/primitives';
import {
  CURRENT_BALANCE,
  HELD_BALANCE,
  MOCK_LEDGER,
  MONTHLY_GRANT,
  SUBSCRIPTION_TIER,
} from '../_fixtures/wallet';

export default function WalletPage() {
  const spentThisMonth = 105_000;
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Wallet</h1>
        <p className="text-[color:var(--color-gv-text-muted)]">
          The wallet is one of the most theme-sensitive surfaces. Credits recur everywhere; their
          color must read as value, not warning. Balances use tabular numerics so eyes can scan.
        </p>
      </header>

      <section className="grid grid-cols-3 gap-3">
        <div className="gv-surface gv-border gv-rounded col-span-2 flex flex-col gap-4 border p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium tracking-[0.18em] text-[color:var(--color-gv-text-muted)] uppercase">
                Available
              </span>
              <Credits value={CURRENT_BALANCE} className="!text-5xl" />
              <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
                Held on pledges: <Credits value={HELD_BALANCE} />
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge tone="accent">{SUBSCRIPTION_TIER}</Badge>
              <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
                Renews Apr 30
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between text-[11px] text-[color:var(--color-gv-text-muted)]">
              <span>Monthly grant spent</span>
              <span>
                <Credits value={spentThisMonth} /> of <Credits value={MONTHLY_GRANT} />
              </span>
            </div>
            <Progress value={spentThisMonth} max={MONTHLY_GRANT} tone="credits" />
          </div>
        </div>
        <div className="gv-surface gv-border gv-rounded flex flex-col gap-3 border p-6">
          <span className="font-heading text-sm font-semibold">Top-up</span>
          <p className="text-[11px] text-[color:var(--color-gv-text-muted)]">
            One-time credit boost. Appears on your ledger as <code>grant.topup_purchase</code>.
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              { pack: 'Small', price: '$3', credits: 50_000 },
              { pack: 'Medium', price: '$10', credits: 250_000 },
              { pack: 'Large', price: '$25', credits: 700_000 },
            ].map((option) => (
              <button
                key={option.pack}
                type="button"
                className="gv-surface-muted gv-border gv-rounded flex cursor-pointer items-center justify-between border px-3 py-2 text-xs hover:border-[color:var(--color-gv-accent)]"
              >
                <span className="font-medium">
                  {option.pack} · {option.price}
                </span>
                <Credits value={option.credits} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="ledger-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 id="ledger-heading" className="font-heading text-xl font-semibold">
            Ledger
          </h2>
          <span className="text-[11px] text-[color:var(--color-gv-text-muted)]">
            Append-only · last {MOCK_LEDGER.length} entries
          </span>
        </div>
        <div className="gv-surface gv-border gv-rounded overflow-hidden border">
          {MOCK_LEDGER.map((entry) => (
            <LedgerRow key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </>
  );
}
