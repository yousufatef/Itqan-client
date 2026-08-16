import type { FieldValues } from 'react-hook-form';
import type { ComboboxMultipleProps } from './combobox.types';
import { ComboboxField } from './ComboboxField';

function CustomComboboxMultiple<TFieldValues extends FieldValues = FieldValues>({
  onValueChange,
  showSelectAll = true,
  selectAllLabel = 'Select All',
  maxVisibleLabels = 2,
  ...props
}: ComboboxMultipleProps<TFieldValues>) {
  return (
    <ComboboxField
      {...props}
      mode='multiple'
      maxVisibleLabels={maxVisibleLabels}
      onValueChange={
        onValueChange
          ? (value) => onValueChange(Array.isArray(value) ? value : value ? [value] : [])
          : undefined
      }
      selectAllLabel={selectAllLabel}
      showSelectAll={showSelectAll}
    />
  );
}

export default CustomComboboxMultiple;
