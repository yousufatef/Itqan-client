import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import type { FieldValues } from 'react-hook-form';

type CustomCheckboxProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<typeof Checkbox>,
  'checked' | 'defaultChecked' | 'name'
> &
  Omit<FieldBaseProps<TFieldValues>, 'labelClassName' | 'subLabel'> & {
    description?: string;
    checkboxClassName?: string;
  };

function CustomCheckbox<TFieldValues extends FieldValues = FieldValues>({
  id,
  control,
  name,
  label,
  description,
  helperText,
  required,
  optional,
  wrapperClassName,
  checkboxClassName,
  className,
  onCheckedChange,
  ...props
}: CustomCheckboxProps<TFieldValues>) {
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;

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
        <div
          onClick={(e) => e.stopPropagation()}
          className={formFieldStyles.checkboxRow}
        >
          <Checkbox
            {...props}
            aria-invalid={fieldState.invalid}
            checked={Boolean(field.value)}
            className={cn(formFieldStyles.checkbox, checkboxClassName, className)}
            id={checkboxId}
            name={field.name}
            onBlur={field.onBlur}
            onCheckedChange={(checked) => {
              field.onChange(checked === true);
              onCheckedChange?.(checked);
            }}
            ref={field.ref}
            required={required}
          />
          <div className='grid gap-1'>
            {label ? (
              <label
                className={cn(formFieldStyles.label, 'cursor-pointer')}
                htmlFor={checkboxId}
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
        </div>
      )}
    </FieldLayout>
  );
}

export default CustomCheckbox;
