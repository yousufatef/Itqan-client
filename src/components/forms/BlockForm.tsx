import CustomInput, { CustomTextarea } from '@/components/forms';
import { CustomImageUploader } from '@/components/shared/customs';
import { useFormContext, type Control, type FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

// ─── Field name configuration ────────────────────────────────────────────────
export interface BlockFormFieldNames {
  /** Field name for the English title input (default: 'titleEn') */
  titleEn?: string;
  /** Field name for the Arabic title input (default: 'titleAr') */
  titleAr?: string;
  /** Field name for the English description textarea (default: 'descriptionEn') */
  descriptionEn?: string;
  /** Field name for the Arabic description textarea (default: 'descriptionAr') */
  descriptionAr?: string;
  /** Field name for the cover image (default: 'coverImage') */
  coverImage?: string;
  /** Field name for the cover image preview (default: 'coverPreview') */
  coverPreview?: string;
}

// ─── Label / placeholder overrides ───────────────────────────────────────────
export interface BlockFormLabels {
  titleEn?: string;
  titleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

export interface BlockFormPlaceholders {
  titleEn?: string;
  titleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

// ─── Section visibility ─────────────────────────────────────────────────────
export interface BlockFormSections {
  /** Show the bilingual title row (default: true) */
  showTitle?: boolean;
  /** Show the bilingual description row (default: true) */
  showDescription?: boolean;
  /** Show the cover image uploader (default: true) */
  showCoverImage?: boolean;
}

// ─── Component props ────────────────────────────────────────────────────────
export interface BlockFormProps {
  /** Section heading displayed above the fields */
  heading?: string;
  /** Override the form control – when omitted, uses useFormContext */
  control?: Control<FieldValues>;
  /** Custom field names to map to a different form schema */
  fieldNames?: BlockFormFieldNames;
  /** Override the default translated labels */
  labels?: BlockFormLabels;
  /** Override the default placeholders */
  placeholders?: BlockFormPlaceholders;
  /** Toggle individual sections on/off */
  sections?: BlockFormSections;
  /** Additional class name for the wrapper */
  className?: string;
  /** Extra content rendered after the built-in fields */
  children?: React.ReactNode;
}

// ─── Defaults ───────────────────────────────────────────────────────────────
const DEFAULT_FIELD_NAMES: Required<BlockFormFieldNames> = {
  titleEn: 'titleEn',
  titleAr: 'titleAr',
  descriptionEn: 'descriptionEn',
  descriptionAr: 'descriptionAr',
  coverImage: 'coverImage',
  coverPreview: 'coverPreview',
};

const DEFAULT_SECTIONS: Required<BlockFormSections> = {
  showTitle: true,
  showDescription: true,
  showCoverImage: true,
};

export function BlockForm({
  heading,
  control: controlProp,
  fieldNames,
  labels,
  placeholders,
  sections,
  className,
  children,
}: BlockFormProps) {
  const { t } = useTranslation();
  const formContext = useFormContext();
  const control = controlProp ?? formContext.control;

  // Merge with defaults
  const names = { ...DEFAULT_FIELD_NAMES, ...fieldNames };
  const show = { ...DEFAULT_SECTIONS, ...sections };

  // Resolved labels (fall back to generic common translation keys)
  const resolvedLabels = {
    titleEn: labels?.titleEn ?? t('common.blockForm.labels.titleEn'),
    titleAr: labels?.titleAr ?? t('common.blockForm.labels.titleAr'),
    descriptionEn: labels?.descriptionEn ?? t('common.blockForm.labels.descriptionEn'),
    descriptionAr: labels?.descriptionAr ?? t('common.blockForm.labels.descriptionAr'),
  };

  // Resolved placeholders (fall back to generic common translation keys)
  const resolvedPlaceholders = {
    titleEn: placeholders?.titleEn ?? t('common.blockForm.placeholders.titleEn'),
    titleAr: placeholders?.titleAr ?? t('common.blockForm.placeholders.titleAr'),
    descriptionEn: placeholders?.descriptionEn ?? t('common.blockForm.placeholders.descriptionEn'),
    descriptionAr: placeholders?.descriptionAr ?? t('common.blockForm.placeholders.descriptionAr'),
  };

  return (
    <div className={cn('flex flex-col gap-5 border-b border-neutral-50 pb-4', className)}>
      {heading && <h2 className='text-xl font-bold text-gray-900'>{heading}</h2>}

      {show.showTitle && (
        <div className='flex items-start gap-4'>
          <CustomInput
            control={control}
            label={resolvedLabels.titleEn}
            name={names.titleEn}
            placeholder={resolvedPlaceholders.titleEn}
          />
          <CustomInput
            control={control}
            label={resolvedLabels.titleAr}
            name={names.titleAr}
            placeholder={resolvedPlaceholders.titleAr}
          />
        </div>
      )}

      {show.showDescription && (
        <div className='flex items-start gap-4'>
          <CustomTextarea
            control={control}
            label={resolvedLabels.descriptionEn}
            name={names.descriptionEn}
            placeholder={resolvedPlaceholders.descriptionEn}
            trimValue={false}
            className='h-23.5 min-h-23.5 max-w-full min-w-0 overflow-auto'
            wrapperClassName='flex-1 max-w-full min-w-0'
          />
          <CustomTextarea
            control={control}
            label={resolvedLabels.descriptionAr}
            name={names.descriptionAr}
            placeholder={resolvedPlaceholders.descriptionAr}
            trimValue={false}
            className='h-23.5 min-h-23.5 max-w-full min-w-0 overflow-auto'
            wrapperClassName='flex-1 max-w-full min-w-0'
          />
        </div>
      )}

      {show.showCoverImage && (
        <CustomImageUploader
          control={control}
          name={names.coverImage}
          previewFieldName={names.coverPreview}
        />
      )}

      {children}
    </div>
  );
}

export default BlockForm;
