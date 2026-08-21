import { useId, type ReactNode } from 'react';
import {
  Controller,
  type ControllerFieldState,
  type ControllerRenderProps,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

import { useTranslation } from 'react-i18next';
import FieldMessage from './FieldMessage';
import { formFieldStyles } from './form-field.styles';

export type FieldLayoutProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: React.ReactNode;
  subLabel?: string;
  optional?: boolean;
  required?: boolean;
  hint?: string;
  className?: string;
  htmlFor?: string;
  labelClassName?: string;
} & (
    | {
      children: (
        field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>,
        fieldState: ControllerFieldState,
      ) => ReactNode;
    }
    | {
      children: ReactNode;
    }
  );

function FieldLayout<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  subLabel,
  optional = false,
  required = false,
  hint,
  className = '',
  htmlFor,
  labelClassName,
  children,
}: FieldLayoutProps<TFieldValues>) {
  const { t } = useTranslation();
  const messageId = useId();
  const requiredMessage = `${label ?? 'هذا الحقل'} مطلوب`;

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? requiredMessage : false,
      }}
      render={({ field, fieldState }) => (
        <Field
          data-field-name={field.name}
          data-invalid={fieldState.invalid}
          className={className}
        >
          {label && (
            <FieldLabel
              onClick={(e) => e.preventDefault()}
              htmlFor={htmlFor ?? field.name}
              className={cn(
                formFieldStyles.label,
                labelClassName,
                'type-body-sm-semibold! ms-4 text-neutral-900',
              )}
            >
              {label}{' '}
              {optional ? (
                <span className='type-body-sm text-neutral-900'>{t('common.optional')}</span>
              ) : required ? (
                <span className='ms-0.5 font-bold'>*</span>
              ) : (
                ''
              )}
            </FieldLabel>
          )}

          {subLabel && (
            <FieldDescription className='type-body-sm-semibold text-neutral-900'>
              {subLabel}
            </FieldDescription>
          )}

          <div className='flex min-w-0 flex-col'>
            {typeof children === 'function' ? children(field, fieldState) : children}
            <FieldMessage
              error={fieldState.error?.message}
              helperText={hint}
              id={messageId}
            />
          </div>
        </Field>
      )}
    />
  );
}

export default FieldLayout;
