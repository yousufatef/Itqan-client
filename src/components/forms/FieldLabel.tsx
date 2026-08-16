import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { formFieldStyles } from './form-field.styles';

type FieldLabelProps = {
  htmlFor?: string;
  label?: string;
  required?: boolean;
  className?: string;
};

function FieldLabel({ htmlFor, label, required, className }: FieldLabelProps) {
  if (!label) return null;

  return (
    <Label
      className={cn(formFieldStyles.label, className)}
      htmlFor={htmlFor}
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
    </Label>
  );
}

export default FieldLabel;
