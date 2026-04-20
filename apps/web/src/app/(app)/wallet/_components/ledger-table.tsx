'use client';

import { useMemo } from 'react';

import { CreditChip, DataTable, type ColumnDef } from '@/components/gamevine';

import { LEDGER_TYPE_LABEL, type LedgerEntry } from '../_data';

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function LedgerTable({ data }: { data: LedgerEntry[] }) {
  const columns = useMemo<ColumnDef<LedgerEntry>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {dateFormat.format(new Date(row.original.createdAt))}
          </span>
        ),
        sortingFn: (a, b) => a.original.createdAt.localeCompare(b.original.createdAt),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <span className="text-foreground text-sm font-medium">
            {LEDGER_TYPE_LABEL[row.original.type]}
          </span>
        ),
      },
      {
        accessorKey: 'reason',
        header: 'Reason',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-foreground text-sm">{row.original.reason}</span>
            {row.original.refLabel ? (
              <span className="text-muted-foreground text-xs">{row.original.refLabel}</span>
            ) : null}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'amount',
        header: () => <span className="ml-auto">Amount</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <CreditChip value={row.original.amount} size="sm" signed tone="soft" suffix={null} />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable<LedgerEntry>
      columns={columns}
      data={data}
      pageSize={10}
      filterPlaceholder="Search ledger…"
    />
  );
}
