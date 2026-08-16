import { z } from 'zod';
import { titleEnSchema, titleItSchema } from '@/utils/schemas';
import type { TFunction } from 'i18next';

export const getPromoCodeSchema = (t: TFunction) =>
  z
    .object({
      codeNameEn: titleEnSchema,

      codeNameIt: titleItSchema,

      code: z
        .string()
        .trim()
        .min(3, {
          message: t(
            'promo.form.errors.codeMin',
          ),
        })
        .max(20, {
          message: t(
            'promo.form.errors.codeMax'
          ),
        })
        .regex(/^[A-Z0-9_-]+$/, {
          message: t(
            'promo.form.errors.codeInvalid',          ),
        }),

      // 1 = Fixed
      // 0 = Percentage
      discountType: z.coerce
        .number()
        .int({
          message: t(
            'promo.form.errors.discountTypeInvalid',
  
          ),
        }),

      discountValue: z.coerce.number({
        error: t(
          'promo.form.errors.discountInvalid',
        ),
      }),

      maxUsesPerUser: z.coerce
        .number({
          error: t(
            'promo.form.errors.maxUsesInvalid',
          ),
        })
        .int({
          message: t(
            'promo.form.errors.maxUsesInteger'
            ),
        })
        .min(1, {
          message: t(
            'promo.form.errors.maxUsesMin'
          ),
        })
        .max(1000, {
          message: t(
            'promo.form.errors.maxUsesMax'
          ),
        }),

      startDate: z.string().min(1, {
        message: t(
          'promo.form.errors.startDateRequired'
        ),
      }),

      endDate: z.string().min(1, {
        message: t(
          'promo.form.errors.endDateRequired',
        ),
      }),
    })
    .superRefine((data, ctx) => {
      // Validate discount value based on discount type
      if (data.discountType === 1) {
        // Percentage: 0 - 100%
        if (data.discountValue < 0 || data.discountValue > 100) {
          ctx.addIssue({
            code: 'custom',
            path: ['discountValue'],
            message: t(
              'promo.form.errors.percentageRange'
            ),
          });
        }
      }

      if (data.discountType === 0) {
        // Fixed: 0 - 990 EGP
        if (data.discountValue < 0 || data.discountValue > 990) {
          ctx.addIssue({
            code: 'custom',
            path: ['discountValue'],
            message: t(
              'promo.form.errors.fixedRange',
            ),
          });
        }
      }

      // End date must not be before start date
      if (
        data.startDate &&
        data.endDate &&
        new Date(data.endDate) < new Date(data.startDate)
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: t(
            'promo.form.errors.endDateBeforeStart'
          ),
        });
      }
    });

export type PromoCodeFormValues = z.infer<
  ReturnType<typeof getPromoCodeSchema>
>;
