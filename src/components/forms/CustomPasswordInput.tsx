import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { InputTrimmer, trimStringValues } from '@/utils/input';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import type { FieldValues } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

type CustomPasswordInputProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  'name' | 'type'
> &
  FieldBaseProps<TFieldValues> & {
    inputClassName?: string;
    trimValue?: boolean;
    startIcon?: React.ReactNode;
  };

function CustomPasswordInput<TFieldValues extends FieldValues = FieldValues>({
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
}: CustomPasswordInputProps<TFieldValues>) {
  const [visible, setVisible] = React.useState(false);
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
      {(field, fieldState) => {
        const hasValue = String(field.value ?? '').length > 0;

        return (
          <div className='relative'>
            {startIcon ? (
              <span className='pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-neutral-400'>
                {startIcon}
              </span>
            ) : null}
            <Input
              aria-invalid={fieldState.invalid}
              className={cn(
                formFieldStyles.control,
                fieldState.invalid && 'border-destructive ring-destructive/20 ring-2',
                'ltr:pr-12 rtl:pl-12',
                startIcon && 'ps-11!',
                inputClassName,
                className,
              )}
              id={inputId}
              required={required}
              type={visible ? 'text' : 'password'}
              {...props}
              {...field}
              onBlur={(event) => {
                if (trimValue && typeof event.currentTarget.value === 'string') {
                  event.currentTarget.value = trimStringValues(
                    InputTrimmer(event.currentTarget.value),
                  ) as string;
                }

                if (!event.currentTarget.value) {
                  setVisible(false);
                }

                field.onBlur();
                onBlur?.(event);
              }}
              onChange={(event) => {
                if (trimValue && typeof event.currentTarget.value === 'string') {
                  event.currentTarget.value = InputTrimmer(event.currentTarget.value) as string;
                }

                if (!event.currentTarget.value) {
                  setVisible(false);
                }

                field.onChange(event);
                onChange?.(event);
              }}
            />
            <button
              aria-label={visible ? 'Hide password' : 'Show password'}
              className='text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ltr:right-4 rtl:left-4'
              disabled={props.disabled || !hasValue}
              onClick={() => {
                setVisible((current) => !current);
              }}
              type='button'
            >
              {visible ? (
                <EyeOff className='h-4 w-4' aria-hidden='true' />
              ) : (
                <Eye className='h-4 w-4' aria-hidden='true' />
              )}
            </button>
          </div>
        );
      }}
    </FieldLayout>
  );
}

export default CustomPasswordInput;
