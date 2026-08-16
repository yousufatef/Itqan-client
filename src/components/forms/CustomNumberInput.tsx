import CustomInput, { type CustomInputProps } from './CustomInput';
import type { FieldValues } from 'react-hook-form';

type CustomNumberInputProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  CustomInputProps<TFieldValues>,
  'inputMode' | 'type'
>;

function CustomNumberInput<TFieldValues extends FieldValues = FieldValues>(
  props: CustomNumberInputProps<TFieldValues>,
) {
  return (
    <CustomInput
      inputMode='numeric'
      type='number'
      {...props}
    />
  );
}

export default CustomNumberInput;
