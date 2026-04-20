'use client';

import type { ReactNode } from 'react';
import type { Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField as PrimitiveFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

/**
 * One-prop wrapper over the shadcn Form primitive set.
 *
 * Collapses the five-line repetitive pattern (`FormField` → `FormItem` →
 * `FormLabel` → `FormControl` → `FormMessage`) into a single `<FormField>`
 * call. Children render inside `FormControl` and receive react-hook-form's
 * `field` props (`value`, `onChange`, `onBlur`, `name`, `ref`) via a render
 * prop, so any control can drop in:
 *
 * ```tsx
 * <FormField control={form.control} name="email" label="Email">
 *   {(field) => <Input {...field} />}
 * </FormField>
 * ```
 *
 * Callers who need full access to `fieldState` / `formState` should use the
 * underlying `FormField` re-exported from `@/components/ui/form`.
 *
 * Must be a Client Component because it relies on RHF context.
 */
export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  /** RHF `Control` from `useForm()`. */
  control: Control<TFieldValues>;
  /** Field name path; type-checked against `TFieldValues`. */
  name: TName;
  /** Label rendered above the control. */
  label: ReactNode;
  /** Optional helper text rendered between the control and any error. */
  description?: ReactNode;
  /** Render prop receiving RHF's `field`. Wire it into the actual input. */
  children: (field: ControllerRenderProps<TFieldValues, TName>) => ReactNode;
  className?: string;
};

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, label, description, children, className }: FormFieldProps<TFieldValues, TName>) {
  return (
    <PrimitiveFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem data-slot="form-field" className={cn(className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>{children(field)}</FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
