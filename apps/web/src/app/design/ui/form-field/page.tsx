'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormField, PageHeader } from '@/components/gamevine';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ComponentExample } from '../_components/component-example';

const profileSchema = z.object({
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters.')
    .max(20, 'Handle is at most 20 characters.')
    .regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, and underscores only.'),
  displayName: z.string().min(1, 'Display name is required.'),
});

type ProfileValues = z.infer<typeof profileSchema>;

function ProfileFormDemo() {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { handle: '', displayName: '' },
    mode: 'onTouched',
  });

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(() => undefined)}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="handle"
          label="Handle"
          description="Lowercase, 3–20 chars, underscores allowed."
        >
          {(field) => <Input placeholder="raz_dev" {...field} />}
        </FormField>
        <FormField control={form.control} name="displayName" label="Display name">
          {(field) => <Input placeholder="Raz" {...field} />}
        </FormField>
        <Button type="submit" size="sm">
          Save profile
        </Button>
      </form>
    </Form>
  );
}

export default function FormFieldGalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Composites"
        title="Form field"
        description="One-line wrapper over the shadcn Form primitive set. Pairs with react-hook-form + zod for validation; submit empty to surface the error states."
      />

      <div className="flex flex-col gap-8">
        <ComponentExample
          title="Profile form"
          description="Touch a field and tab away (or hit Save) to trigger the zod validation."
        >
          <ProfileFormDemo />
        </ComponentExample>
      </div>
    </>
  );
}
