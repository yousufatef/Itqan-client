import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { InputTrimmer, trimStringValues } from '@/utils/input';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import type { FieldValues } from 'react-hook-form';
import { useDirection } from '@/i18n/useDirection';

export type CustomInputProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  'name'
> &
  FieldBaseProps<TFieldValues> & {
    inputClassName?: string;
    trimValue?: boolean;
    startIcon?: React.ReactNode;
  };

function CustomInput<TFieldValues extends FieldValues = FieldValues>({
  id,
  control,
  name,
  label,
  helperText,
  required,
  optional,
  subLabel,
  wrapperClassName,
  labelClassName,
  inputClassName,
  trimValue = true,
  startIcon,
  className,
  onBlur,
  onChange,
  ...props
}: CustomInputProps<TFieldValues>) {
  const dir = useDirection();
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <FieldLayout
      className={cn(formFieldStyles.root, wrapperClassName)}
      control={control}
      hint={helperText}
      htmlFor={inputId}
      labelClassName={labelClassName}
      name={name}
      optional={optional}
      required={required}
      subLabel={subLabel}
      label={label}
    >
      {(field, fieldState) => (
        <div className='relative'>
          {startIcon ? (
            <span className='pointer-events-none absolute top-1/2 ltr:left-4 rtl:right-4 z-10 -translate-y-1/2 text-neutral-400'>
              {startIcon}
            </span>
          ) : null}
          <Input
            aria-invalid={fieldState.invalid}
            className={cn(
              formFieldStyles.control,
              startIcon && 'ps-11!',
              inputClassName,
              className,
            )}
            dir={dir}
            id={inputId}
            {...props}
            {...field}
            onBlur={(event) => {
              if (trimValue && typeof event.currentTarget.value === 'string') {
                event.currentTarget.value = trimStringValues(
                  InputTrimmer(event.currentTarget.value),
                ) as string;
              }

              field.onBlur();
              onBlur?.(event);
            }}
            onChange={(event) => {
              if (trimValue && typeof event.currentTarget.value === 'string') {
                event.currentTarget.value = InputTrimmer(event.currentTarget.value) as string;
              }

              field.onChange(event);
              onChange?.(event);
            }}
          />
        </div>
      )}
    </FieldLayout>
  );
}

export default CustomInput;
