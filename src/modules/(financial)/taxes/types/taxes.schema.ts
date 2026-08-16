import { z } from 'zod';
import { titleEnSchema, titleItSchema } from '@/utils/schemas';
import type { TFunction } from 'i18next';

export const getTaxSchema = (t: TFunction) =>
  z
    .object({
      nameEn: titleEnSchema,
      nameIt: titleItSchema,
      calculationType: z.coerce
        .number({
          error: t('taxes.form.errors.calculationTypeRequired'),
        })
        .min(0)
        .max(1),
      rate: z.coerce
        .number({
          error: t('taxes.form.errors.rate.invalid'),
        })
        .min(0, { message: t('taxes.form.errors.rate.min') })
        .refine(
          (val) => {
            if (val === undefined || val === null || Number.isNaN(val)) return false;
            const str = val.toString();
            if (str.includes('.')) {
              const decimals = str.split('.')[1];
              return decimals ? decimals.length <= 2 : true;
            }
            return true;
          },
          { message: t('taxes.form.errors.rate.maxDecimals', 'Rate can have at most 2 decimal places') },
        ),
      type: z.coerce
        .number({
          error: t('taxes.form.errors.taxTypeRequired'),
        })
        .min(0, { message: t('taxes.form.errors.taxTypeRequired') }),
    })
    .superRefine((data, ctx) => {
      if (data.calculationType === 1) { // Percentage
        if (data.rate > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['rate'],
            message: t(
              'taxes.form.errors.rate.maxPercentage',
              'Percentage rate cannot exceed 100%',
            ),
          });
        }
      } else if (data.calculationType === 0) { // Fixed
        if (data.rate > 9999.99) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['rate'],
            message: t(
              'taxes.form.errors.rate.maxFixed',
              'Fixed price cannot exceed 4 digits (9999.99)',
            ),
          });
        }
      }
    });

export type TaxFormValues = {
  nameEn: string;
  nameIt: string;
  calculationType: number;
  rate: number;
  type: number;
};

