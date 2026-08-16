import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { InputTrimmer, trimStringValues } from '@/utils/input';
import FieldLayout from './FieldLayout';
import { formFieldStyles } from './form-field.styles';
import type { FieldBaseProps } from './field.types';
import type { FieldValues } from 'react-hook-form';

type CustomTextareaProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  React.ComponentProps<typeof Textarea>,
  'name'
> &
  FieldBaseProps<TFieldValues> & {
    textareaClassName?: string;
    trimValue?: boolean;
  };

function CustomTextarea<TFieldValues extends FieldValues = FieldValues>({
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
  textareaClassName,
  trimValue = true,
  className,
  onBlur,
  onChange,
  ...props
}: CustomTextareaProps<TFieldValues>) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;

  return (
    <FieldLayout
      className={cn(formFieldStyles.root, wrapperClassName)}
      control={control}
      hint={helperText}
      htmlFor={textareaId}
      labelClassName={labelClassName}
      name={name}
      optional={optional}
      required={required}
      subLabel={subLabel}
      label={label}
    >
      {(field, fieldState) => (
        <Textarea
          aria-invalid={fieldState.invalid}
          className={cn(
            formFieldStyles.textarea,
            'min-h-36 resize-none rounded',
            textareaClassName,
            className,
          )}
          id={textareaId}
          required={required}
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
      )}
    </FieldLayout>
  );
}

export default CustomTextarea;
