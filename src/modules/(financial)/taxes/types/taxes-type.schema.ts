import { z } from 'zod';
import { titleEnSchema, titleItSchema } from '@/utils/schemas';
import type { TFunction } from 'i18next';

export const getTaxTypeSchema = (_t?: TFunction) =>
  z.object({
    nameEn: titleEnSchema,
    nameIt: titleItSchema,
  });

export type TaxTypeFormValues = z.infer<ReturnType<typeof getTaxTypeSchema>>;
