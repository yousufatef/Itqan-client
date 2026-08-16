import * as React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { cn } from '@/lib/utils';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import type { FieldValues } from 'react-hook-form';

export type CustomRadioGroupOption = {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
};

type CustomRadioGroupProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<typeof RadioGroup>,
  'name'
> &
  FieldBaseProps<TFieldValues> & {
    options: CustomRadioGroupOption[];
    itemClassName?: string;
    optionClassName?: string;
  };

function CustomRadioGroup<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  optional,
  subLabel,
  wrapperClassName,
  labelClassName,
  itemClassName,
  optionClassName,
  options,
  className,
  onValueChange,
  ...props
}: CustomRadioGroupProps<TFieldValues>) {
  const generatedId = React.useId();
  const groupId = generatedId;

  return (
    <FieldLayout
      className={cn(formFieldStyles.root, wrapperClassName)}
      control={control}
      hint={helperText}
      htmlFor={groupId}
      labelClassName={labelClassName}
      name={name}
      optional={optional}
      required={required}
      subLabel={subLabel}
      label={label}
    >
      {(field, fieldState) => (
        <RadioGroup
          {...props}
          aria-invalid={fieldState.invalid}
          className={cn('gap-2', className)}
          name={field.name}
          onBlur={field.onBlur}
          onValueChange={(value) => {
            field.onChange(value);
            onValueChange?.(value);
          }}
          ref={field.ref}
          required={required}
          value={field.value ?? ''}
        >
          {options.map((option) => {
            const optionId = `${groupId}-${option.value}`;

            return (
              <label
                className={cn(
                  'bg-background hover:bg-accent/60 flex cursor-pointer items-start gap-3 rounded-md border p-3 shadow-xs transition-colors has-data-disabled:pointer-events-none has-data-disabled:opacity-50',
                  optionClassName,
                )}
                htmlFor={optionId}
                key={option.value}
              >
                <RadioGroupItem
                  className={cn('mt-0.5', itemClassName)}
                  disabled={option.disabled}
                  id={optionId}
                  value={option.value}
                />
                <span className='grid gap-1'>
                  <span className={formFieldStyles.label}>{option.label}</span>
                  {option.description ? (
                    <span className={formFieldStyles.helper}>{option.description}</span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </RadioGroup>
      )}
    </FieldLayout>
  );
}

export default CustomRadioGroup;
