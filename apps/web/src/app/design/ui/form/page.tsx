'use client';

import { useForm } from 'react-hook-form';

import { PageHeader } from '@/components/gamevine';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ComponentExample } from '../_components/component-example';

type SignInValues = { email: string };

function PrimitiveDemo() {
  const form = useForm<SignInValues>({ defaultValues: { email: '' } });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => undefined)}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@gamevine.ai" {...field} />
              </FormControl>
              <FormDescription>We&apos;ll never share your address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm">
          Continue
        </Button>
      </form>
    </Form>
  );
}

export default function FormPrimitivePage() {
  return (
    <>
      <PageHeader
        eyebrow="Primitives"
        title="Form"
        description={
          <>
            Shadcn&apos;s react-hook-form bridge: <code className="font-mono text-xs">Form</code>,{' '}
            <code className="font-mono text-xs">FormField</code>,{' '}
            <code className="font-mono text-xs">FormItem</code>,{' '}
            <code className="font-mono text-xs">FormLabel</code>,{' '}
            <code className="font-mono text-xs">FormControl</code>,{' '}
            <code className="font-mono text-xs">FormDescription</code>, and{' '}
            <code className="font-mono text-xs">FormMessage</code>. Reach for the{' '}
            <code className="font-mono text-xs">FormField</code> composite under Composites for the
            terser API.
          </>
        }
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Single field"
          description="The full primitive API: explicit FormField + FormItem + FormControl + FormMessage chain."
        >
          <PrimitiveDemo />
        </ComponentExample>
      </div>
    </>
  );
}
