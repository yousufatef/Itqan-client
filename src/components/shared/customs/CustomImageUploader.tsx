import * as React from 'react';
import imageCompression from 'browser-image-compression';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import FieldLayout from '@/components/forms/FieldLayout';
import FieldMessage from '@/components/forms/FieldMessage';
import { formFieldStyles } from '@/components/forms/form-field.styles';
import type { FieldBaseProps } from '@/components/forms/field.types';
import type { FieldValues } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ACCEPTED_IMAGE_FILE_TYPES,
  IMAGE_COMPRESSION_MAX_SIZE_MB,
  IMAGE_COMPRESSION_MAX_WIDTH_OR_HEIGHT,
  MAX_IMAGE_FILE_SIZE_BYTES,
  // MAX_IMAGE_FILE_SIZE_MB,
} from '@/constants';
import {
  getImageFileSizeErrorMessage,
  getImageFileTypeErrorMessage,
  isAcceptedImageFile,
} from '@/utils/schemas';
import { getCurrLocale } from '@/utils/language';

type CustomImageUploaderProps<TFieldValues extends FieldValues = FieldValues> =
  FieldBaseProps<TFieldValues> & {
    disabled?: boolean;
    previewFieldName?: string; // Name of the field containing preview URL (e.g., 'coverPreview')
  };

// const formatBytes = (bytes: number) => {
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
// 
//   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
// };

// const getFriendlyType = (type: string) => {
//   if (type === 'image/jpeg') return 'JPG';
//   if (type.endsWith('/*')) return type.replace('/*', '').toUpperCase();
//   if (type.startsWith('.')) return type.slice(1).toUpperCase();

//   return type.split('/')[1]?.toUpperCase() ?? type;
// };

// const getFriendlyTypes = (types: string[]) => [...new Set(types.map(getFriendlyType))].join(', ');

const getFileFromValue = (value: unknown) => {
  if (!value) return null;
  if (value instanceof File) return value;

  return null;
};

const shouldCompressImage = (file: File) => file.type !== 'image/gif';

const compressImageFile = async (file: File) => {
  if (!shouldCompressImage(file)) return file;

  const compressedBlob = await imageCompression(file, {
    maxSizeMB: IMAGE_COMPRESSION_MAX_SIZE_MB,
    maxWidthOrHeight: IMAGE_COMPRESSION_MAX_WIDTH_OR_HEIGHT,
    useWebWorker: true,
  });

  if (compressedBlob.size >= file.size) return file;

  return new File([compressedBlob], file.name, {
    lastModified: file.lastModified,
    type: compressedBlob.type || file.type,
  });
};

function CustomImageUploader<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  helperText,
  required,
  optional,
  subLabel,
  wrapperClassName,
  labelClassName,
  disabled = false,
  previewFieldName,
}: CustomImageUploaderProps<TFieldValues>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isCompressing, setIsCompressing] = React.useState(false);
  const acceptedTypes = [...ACCEPTED_IMAGE_FILE_TYPES];
  const acceptAttr = acceptedTypes.join(',');
  const { t } = useTranslation();
  const isIt = getCurrLocale() === 'it';

  const { clearErrors, trigger } = useFormContext();


  // Watch for preview field value (for edit mode with existing images)
  const existingPreviewUrl = useWatch({
    control,
    name: previewFieldName as any
  }) as string | null | undefined;

  React.useEffect(() => {
    const preventFileNavigation = (event: DragEvent) => {
      if (!event.dataTransfer?.types.includes('Files')) return;

      event.preventDefault();
    };

    window.addEventListener('dragover', preventFileNavigation);
    window.addEventListener('drop', preventFileNavigation);

    return () => {
      window.removeEventListener('dragover', preventFileNavigation);
      window.removeEventListener('drop', preventFileNavigation);
    };
  }, []);

  return (
    <FieldLayout
      className={cn(formFieldStyles.root, wrapperClassName)}
      control={control}
      hint={helperText}
      label={label}
      labelClassName={labelClassName}
      name={name}
      optional={optional}
      required={required}
      subLabel={subLabel}
    >
      {(field, fieldState) => {
        const file = getFileFromValue(field.value);
        const isDisabled = disabled || field.disabled || isCompressing;

        // Update preview URL when file changes
        React.useEffect(() => {
          if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            return () => URL.revokeObjectURL(url);
          } else if (existingPreviewUrl) {
            // Use existing preview URL from edit mode
            setPreviewUrl(existingPreviewUrl);
          } else {
            setPreviewUrl(null);
          }
        }, [file, existingPreviewUrl]);

        const validateAndSet = async (incomingFiles: FileList | null) => {
          setUploadError('');

          if (!incomingFiles?.length) return;

          const selectedFile = incomingFiles[0];

          if (!(await isAcceptedImageFile(selectedFile))) {
            const errorMsg = getImageFileTypeErrorMessage();
            toast({
              description: errorMsg,
              title: isIt ? 'Impossibile accettare il file' : 'File not accepted',
              variant: 'destructive',
            });
            setUploadError(errorMsg);
            return;
          }

          let uploadFile = selectedFile;

          try {
            setIsCompressing(true);
            uploadFile = await compressImageFile(selectedFile);
          } catch (error) {
            console.error(error);
            const errorMsg = isIt
              ? 'Impossibile comprimere l\'immagine. Riprova.'
              : 'Could not compress image. Please try again.';
            toast({
              description: errorMsg,
              title: isIt ? 'Upload fallito' : 'Upload failed',
              variant: 'destructive',
            });
            setUploadError(errorMsg);
            return;
          } finally {
            setIsCompressing(false);
          }

          if (uploadFile.size > MAX_IMAGE_FILE_SIZE_BYTES) {
            const errorMsg = getImageFileSizeErrorMessage();
            toast({
              description: errorMsg,
              title: isIt ? 'File non accettato' : 'File not accepted',
              variant: 'destructive',
            });
            setUploadError(errorMsg);
            return;
          }

          field.onChange(uploadFile);
          clearErrors(name as any);
          void trigger(name as any);
        };



        const handleClick = () => {
          if (!isDisabled) inputRef.current?.click();
        };

        return (
          <div className='flex flex-col gap-2'>
            <div
              aria-disabled={isDisabled}
              aria-invalid={fieldState.invalid}
              aria-label='Upload image'
              className={cn(
                'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 relative flex flex-col items-center justify-center gap-2 rounded-lg border border-neutral-100   transition-colors focus-visible:ring-3 focus-visible:outline-none aria-invalid:ring-3 bg-[#F8F8F8] h-full min-h-46.25 overflow-hidden group',
                dragOver && 'border-primary bg-primary/5',
                isDisabled && 'pointer-events-none cursor-not-allowed opacity-50',
                !isDisabled && 'cursor-pointer',
              )}
              onClick={handleClick}
              onDragEnter={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!isDisabled) setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDragOver={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!isDisabled) setDragOver(true);
              }}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setDragOver(false);
                if (!isDisabled) void validateAndSet(event.dataTransfer.files);
              }}
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && !isDisabled) {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              role='button'
              tabIndex={isDisabled ? -1 : 0}
            >
              {(file || previewUrl) ? (
                <div className='absolute inset-0 size-full overflow-hidden'>
                  <img
                    alt={file?.name ?? 'Package image'}
                    className='size-full object-cover'
                    src={previewUrl ?? ''}
                  />
                  <div className='absolute top-2 left-2 flex items-center gap-1.5 rounded-md bg-white/90 px-2.5 py-1 type-body-md text-neutral-900 shadow-xs backdrop-blur-xs transition-colors hover:bg-white'>
                    <span>Edit</span>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center gap-2 py-4 text-center'>
                  <span className='flex size-10 items-center justify-center text-primary-500'>
                    <svg className='size-8 text-[#B59C5B]' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                      <rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
                      <path d='M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' />
                      <path d='m21 15-5-5-11 11' />
                      <path d='m14 14 2 2' />
                      <path d='m17.5 7.5 1 1 2-2' />
                    </svg>
                  </span>
                  <span className='type-body-md font-medium text-primary-500'>
                    {isCompressing
                      ? isIt
                        ? 'Sto comprimendo l\'immagine...'
                        : 'Compressing image...'
                      : t('common.uploadImage', 'Upload Image')}
                  </span>
                </div>
              )}

              <input
                accept={acceptAttr}
                className='hidden'
                disabled={isDisabled}
                multiple={false}
                onBlur={field.onBlur}
                onChange={(event) => {
                  void validateAndSet(event.target.files);
                }}
                ref={inputRef}
                type='file'
              />
            </div>

            {uploadError ? <FieldMessage error={uploadError} /> : null}
          </div>
        );
      }}
    </FieldLayout>
  );
}

export default CustomImageUploader;
