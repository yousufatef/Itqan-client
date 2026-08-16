import type { FieldValues } from 'react-hook-form';
import type { ComboboxSingleProps } from './combobox.types';
import { ComboboxField } from './ComboboxField';

function CustomComboboxSingle<TFieldValues extends FieldValues = FieldValues>({
  onValueChange,
  ...props
}: ComboboxSingleProps<TFieldValues>) {
  return (
    <ComboboxField
      {...props}
      mode='single'
      onValueChange={
        onValueChange
          ? (value) => onValueChange(typeof value === 'string' ? value : (value[0] ?? ''))
          : undefined
      }
    />
  );
}

export default CustomComboboxSingle;
