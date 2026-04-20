'use client';

import { useMemo } from 'react';

import { CreditChip, DataTable, PageHeader, type ColumnDef } from '@/components/gamevine';
import { ComponentExample } from '../_components/component-example';

type Player = {
  id: string;
  handle: string;
  role: 'free' | 'supporter' | 'patron' | 'admin';
  joinedAt: string;
  credits: number;
};

const PLAYERS: Player[] = [
  { id: '1', handle: 'raz_dev', role: 'admin', joinedAt: '2024-01-12', credits: 12450 },
  { id: '2', handle: 'mira', role: 'patron', joinedAt: '2024-02-04', credits: 9800 },
  { id: '3', handle: 'noor', role: 'supporter', joinedAt: '2024-02-19', credits: 4250 },
  { id: '4', handle: 'kai', role: 'free', joinedAt: '2024-03-02', credits: 0 },
  { id: '5', handle: 'jules', role: 'supporter', joinedAt: '2024-03-11', credits: 3100 },
  { id: '6', handle: 'sasha', role: 'patron', joinedAt: '2024-03-22', credits: 7600 },
  { id: '7', handle: 'leo', role: 'supporter', joinedAt: '2024-04-04', credits: 1850 },
  { id: '8', handle: 'iris', role: 'free', joinedAt: '2024-04-15', credits: 0 },
  { id: '9', handle: 'theo', role: 'patron', joinedAt: '2024-05-01', credits: 8900 },
  { id: '10', handle: 'amelie', role: 'supporter', joinedAt: '2024-05-10', credits: 2500 },
  { id: '11', handle: 'rune', role: 'supporter', joinedAt: '2024-05-22', credits: 4100 },
  { id: '12', handle: 'wren', role: 'free', joinedAt: '2024-06-03', credits: 0 },
  { id: '13', handle: 'ezra', role: 'patron', joinedAt: '2024-06-14', credits: 6700 },
  { id: '14', handle: 'aria', role: 'supporter', joinedAt: '2024-06-26', credits: 3300 },
  { id: '15', handle: 'milo', role: 'free', joinedAt: '2024-07-07', credits: 0 },
  { id: '16', handle: 'soren', role: 'patron', joinedAt: '2024-07-19', credits: 11200 },
  { id: '17', handle: 'cleo', role: 'supporter', joinedAt: '2024-07-30', credits: 1500 },
  { id: '18', handle: 'arlo', role: 'free', joinedAt: '2024-08-09', credits: 0 },
  { id: '19', handle: 'maya', role: 'patron', joinedAt: '2024-08-21', credits: 5400 },
  { id: '20', handle: 'finn', role: 'supporter', joinedAt: '2024-09-02', credits: 2200 },
  { id: '21', handle: 'nyla', role: 'supporter', joinedAt: '2024-09-13', credits: 3800 },
  { id: '22', handle: 'ravi', role: 'free', joinedAt: '2024-09-24', credits: 0 },
  { id: '23', handle: 'ines', role: 'patron', joinedAt: '2024-10-05', credits: 9100 },
  { id: '24', handle: 'omar', role: 'supporter', joinedAt: '2024-10-17', credits: 2750 },
  { id: '25', handle: 'tess', role: 'admin', joinedAt: '2024-10-28', credits: 15600 },
];

function PlayersDemo() {
  const columns = useMemo<ColumnDef<Player>[]>(
    () => [
      {
        accessorKey: 'handle',
        header: 'Handle',
        cell: ({ row }) => <span className="font-mono text-xs">@{row.getValue('handle')}</span>,
      },
      { accessorKey: 'role', header: 'Role' },
      { accessorKey: 'joinedAt', header: 'Joined' },
      {
        accessorKey: 'credits',
        header: 'Credits',
        cell: ({ row }) => (
          <CreditChip value={row.getValue('credits')} size="sm" tone="soft" suffix={null} />
        ),
      },
    ],
    [],
  );

  return (
    <div className="w-full">
      <DataTable<Player>
        columns={columns}
        data={PLAYERS}
        pageSize={5}
        filterPlaceholder="Filter handles, roles, dates…"
      />
    </div>
  );
}

export default function DataTableGalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Composites"
        title="Data table"
        description="TanStack Table headless core composed with our shadcn Table primitive. Click any header to sort, type in the filter to narrow rows, and use the footer to paginate."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Players fixture"
          description="25 fake rows. Sort by Handle / Role / Joined / Credits. Filter is global across all visible columns."
        >
          <PlayersDemo />
        </ComponentExample>
      </div>
    </>
  );
}
