import { APP_NAME, APP_TAGLINE, DEFAULT_API_PORT } from '@gamevine/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${String(DEFAULT_API_PORT)}`;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-start justify-center gap-10 px-6 py-24">
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">Bootstrap OK</p>
        <h1 className="text-5xl font-semibold tracking-tight">{APP_NAME}</h1>
        <p className="text-muted-foreground text-lg">{APP_TAGLINE}</p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Environment check</CardTitle>
          <CardDescription>
            Confirms shared constants, shadcn/ui, Tailwind CSS, and Next.js 16 App Router wiring.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
            <dt>App name (shared)</dt>
            <dd className="text-foreground font-mono">{APP_NAME}</dd>
            <dt>API base URL</dt>
            <dd className="text-foreground font-mono">{apiUrl}</dd>
            <dt>Node env</dt>
            <dd className="text-foreground font-mono">{process.env.NODE_ENV ?? 'unknown'}</dd>
          </dl>
          <div className="flex gap-2">
            <Button variant="default">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
