import { z } from 'zod';
import type { TFunction } from 'i18next';

export const getSmartGuideSchema = (t: TFunction) =>
  z.object({
    titleEn: z.string().min(1, t('smartGuide.form.validation.titleEnRequired', 'English title is required')),
    titleIt: z.string().min(1, t('smartGuide.form.validation.titleItRequired', 'Italian title is required')),
    descriptionEn: z.string().optional(),
    descriptionIt: z.string().optional(),
    order: z.number().optional(),
    videoFile: z.union([z.instanceof(File), z.string()]).optional(),
    thumbnailFile: z.union([z.instanceof(File), z.string()]).optional(),
  });

export type SmartGuideFormValues = z.infer<ReturnType<typeof getSmartGuideSchema>>;
