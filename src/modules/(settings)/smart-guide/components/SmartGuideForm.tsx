import CustomInput from '@/components/forms/CustomInput';
import CustomTextarea from '@/components/forms/CustomTextarea';
import CustomFileUploader from '@/components/forms/CustomFileUploader';
import EditModal from '@/components/shared/customs/EditModal';
import useLiveForm from '@/hooks/useLiveForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Form } from '@/components/ui/form';
import useCreateSmartGuide from '../hooks/useCreateSmartGuide';
import useUpdateSmartGuide from '../hooks/useUpdateSmartGuide';
import { getSmartGuideSchema, type SmartGuideFormValues } from '../types/smart-guide.schema';
import type { HowToUseApp } from '../types/smart-guide.types';
import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SmartGuideFormProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  smartGuide?: HowToUseApp;
};

export default function SmartGuideForm({ isOpen, setIsOpen, smartGuide }: SmartGuideFormProps) {
  const { t } = useTranslation();
  const isEdit = !!smartGuide;
  
  // Track if the user wants to keep the existing video/thumbnail
  const [keepExistingVideo, setKeepExistingVideo] = useState(true);
  const [keepExistingThumbnail, setKeepExistingThumbnail] = useState(true);

  const form = useLiveForm<SmartGuideFormValues>({
    resolver: zodResolver(getSmartGuideSchema(t)),
    defaultValues: {
      titleEn: '',
      titleIt: '',
      descriptionEn: '',
      descriptionIt: '',
      order: 0,
      videoFile: undefined,
      thumbnailFile: undefined,
    },
    values: isEdit && smartGuide
      ? {
          titleEn: smartGuide.titleEn ?? '',
          titleIt: smartGuide.titleIt ?? '',
          descriptionEn: smartGuide.descriptionEn ?? '',
          descriptionIt: smartGuide.descriptionIt ?? '',
          order: smartGuide.order ?? 0,
          videoFile: smartGuide.fileUrl || undefined,
          thumbnailFile: smartGuide.thumbnailURL || undefined,
        }
      : undefined,
  });

  const { control, handleSubmit, setValue, watch } = form;
  
  const currentVideoValue = watch('videoFile');
  const currentThumbnailValue = watch('thumbnailFile');

  const { mutate: createMutate, isPending: isCreating } = useCreateSmartGuide({
    onSuccess: () => setIsOpen(false),
  });
  
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateSmartGuide({
    onSuccess: () => setIsOpen(false),
  });

  const isPending = isCreating || isUpdating;

  const handleFormSubmit = handleSubmit((values: SmartGuideFormValues) => {
    const formData = new FormData();

    if (isEdit && smartGuide) {
      formData.append('Id', smartGuide.id);
    }

    formData.append('TitleEn', values.titleEn);
    formData.append('TitleIt', values.titleIt);
    
    // Send empty string if description is not provided
    formData.append('DescriptionEn', values.descriptionEn || '');
    formData.append('DescriptionIt', values.descriptionIt || '');
    
    if (values.order !== undefined) {
      formData.append('Order', values.order.toString());
    }

    // Handle video file upload
    if (values.videoFile instanceof File) {
      formData.append('VideoFile', values.videoFile);
    } else {
      // Send empty value if no file selected
      formData.append('VideoFile', '');
    }

    // Handle thumbnail file upload
    if (values.thumbnailFile instanceof File) {
      formData.append('ThumbnailFile', values.thumbnailFile);
    } else {
      // Send empty value if no file selected
      formData.append('ThumbnailFile', '');
    }

    if (isEdit) {
      updateMutate(formData);
    } else {
      createMutate(formData);
    }
  });

  return (
    <Form {...form}>
      <form
        id='smart-guide-form'
        className='h-full w-full'
        onSubmit={handleFormSubmit}
      >
        <EditModal
          isOpen={isOpen}
          toggle={setIsOpen}
          title={isEdit ? t('smartGuide.form.titleEdit', 'Edit Smart Guide') : t('smartGuide.form.titleCreate', 'Add Smart Guide')}
          formId='smart-guide-form'
          submitLabel={t('smartGuide.form.submit', 'Save')}
          isLoading={isPending}
        >
          <div className='col-span-full space-y-5'>
            {/* Video Upload */}
            <div className='space-y-2'>
              {isEdit && smartGuide?.fileUrl && typeof currentVideoValue === 'string' && keepExistingVideo ? (
                <div>
                  <label className='text-sm font-bold mb-2 block'>
                    {t('smartGuide.form.video', 'Upload Video')} *
                  </label>
                  <div className='border-input bg-background flex items-center justify-between gap-3 rounded-lg border p-3 shadow-xs'>
                    <div className='flex min-w-0 items-center gap-3'>
                      <div className='bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-md'>
                        <svg className='size-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                      </div>
                      <div className='min-w-0'>
                        <p className='text-foreground text-sm font-medium truncate'>
                          {t('smartGuide.form.currentVideo', 'Current Video')}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {t('smartGuide.form.uploaded', 'Already uploaded')}
                        </p>
                      </div>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setKeepExistingVideo(false);
                        setValue('videoFile', undefined);
                      }}
                      className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                    >
                      <XIcon className='size-4' />
                    </Button>
                  </div>
                </div>
              ) : (
                <CustomFileUploader
                  control={control}
                  name='videoFile'
                  label={t('smartGuide.form.video', 'Upload Video')}
                  acceptedTypes={['video/*']}
                  maxSizeMB={100}
                  required
                />
              )}
            </div>

            {/* Titles - Two Column Layout */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <CustomInput
                control={control}
                name='titleEn'
                label={t('smartGuide.form.titleEn', 'Title (EN)')}
                placeholder={t('smartGuide.form.titleEnPlaceholder', 'Full Name')}
                required
              />
              <CustomInput
                control={control}
                name='titleIt'
                label={t('smartGuide.form.titleIt', 'Title (IT)')}
                placeholder={t('smartGuide.form.titleItPlaceholder', 'Email')}
                required
              />
            </div>

            {/* Descriptions - Two Column Layout */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <CustomTextarea
                control={control}
                name='descriptionEn'
                label={t('smartGuide.form.descriptionEn', 'Description (EN)')}
                placeholder={t('smartGuide.form.descriptionEnPlaceholder', 'Enter description in English')}
                required
              />
              <CustomTextarea
                control={control}
                name='descriptionIt'
                label={t('smartGuide.form.descriptionIt', 'Description (IT)')}
                placeholder={t('smartGuide.form.descriptionItPlaceholder', 'Enter description in Italy')}
                required
              />
            </div>

            {/* Thumbnail Upload - Optional */}
            <div className='space-y-2'>
              {isEdit && smartGuide?.thumbnailURL && typeof currentThumbnailValue === 'string' && keepExistingThumbnail ? (
                <div>
                  <label className='text-sm font-bold mb-2 block'>
                    {t('smartGuide.form.thumbnail')} *
                  </label>
                  <div className='border-input bg-background flex items-center justify-between gap-3 rounded-lg border p-3 shadow-xs'>
                    <div className='flex min-w-0 items-center gap-3'>
                      <div className='bg-muted flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border'>
                        <img
                          alt='Current thumbnail'
                          className='size-full object-cover'
                          src={smartGuide.thumbnailURL}
                        />
                      </div>
                      <div className='min-w-0'>
                        <p className='text-foreground text-sm font-medium truncate'>
                          {t('smartGuide.form.currentThumbnail')}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {t('smartGuide.form.uploaded')}
                        </p>
                      </div>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setKeepExistingThumbnail(false);
                        setValue('thumbnailFile', undefined);
                      }}
                      className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                    >
                      <XIcon className='size-4' />
                    </Button>
                  </div>
                </div>
              ) : (
                <CustomFileUploader
                  control={control}
                  name='thumbnailFile'
                  label={t('smartGuide.form.thumbnail', 'Thumbnail ')}
                  helperText={t('smartGuide.form.thumbnailHelper', 'Upload a thumbnail image for the video')}
                  acceptedTypes={['image/*']}
                  maxSizeMB={5}
                  required
                />
              )}
            </div>
          </div>
        </EditModal>
      </form>
    </Form>
  );
}
