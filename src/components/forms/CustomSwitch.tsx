import * as React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import type { FieldValues } from 'react-hook-form';

type CustomSwitchProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<typeof Switch>,
  'checked' | 'defaultChecked' | 'name'
> &
  Omit<FieldBaseProps<TFieldValues>, 'labelClassName' | 'subLabel'> & {
    description?: string;
    switchClassName?: string;
  };

function CustomSwitch<TFieldValues extends FieldValues = FieldValues>({
  id,
  control,
  name,
  label,
  description,
  helperText,
  required,
  optional,
  wrapperClassName,
  switchClassName,
  className,
  onCheckedChange,
  ...props
}: CustomSwitchProps<TFieldValues>) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;

  return (
    <FieldLayout
      className={cn(formFieldStyles.root, wrapperClassName)}
      control={control}
      hint={helperText}
      name={name}
      optional={optional}
      required={required}
    >
      {(field, fieldState) => (
        <div className='bg-background flex items-start justify-between gap-4 rounded-md border p-3 shadow-xs'>
          <div className='grid gap-1'>
            {label ? (
              <label
                className={cn(formFieldStyles.label, 'cursor-pointer')}
                htmlFor={switchId}
              >
                {label}
                {required ? (
                  <span
                    aria-hidden='true'
                    className={formFieldStyles.required}
                  >
                    *
                  </span>
                ) : null}
              </label>
            ) : null}
            {description ? <p className={formFieldStyles.helper}>{description}</p> : null}
          </div>

          <Switch
            {...props}
            aria-invalid={fieldState.invalid}
            checked={Boolean(field.value)}
            className={cn(switchClassName, className)}
            id={switchId}
            name={field.name}
            onBlur={field.onBlur}
            onCheckedChange={(checked) => {
              field.onChange(checked);
              onCheckedChange?.(checked);
            }}
            ref={field.ref}
            required={required}
          />
        </div>
      )}
    </FieldLayout>
  );
}

export default CustomSwitch;
