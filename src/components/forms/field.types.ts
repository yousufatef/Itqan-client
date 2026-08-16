import type { Control, FieldPath, FieldValues } from 'react-hook-form';

export type FieldBaseProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  helperText?: string;
  required?: boolean;
  optional?: boolean;
  subLabel?: string;
  wrapperClassName?: string;
  labelClassName?: string;
};
