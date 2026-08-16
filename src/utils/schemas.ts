import {
  ACCEPTED_DOCUMENT_FILE_EXTENSIONS,
  ARABIC_TEXT_REGEX,
  ENGLISH_TEXT_REGEX,
  ITALIAN_TEXT_REGEX,
  MAX_DESCRIPTION_LENGTH,
  MAX_DOCUMENT_FILE_SIZE_BYTES,
  MAX_DOCUMENT_FILE_SIZE_MB,
  MAX_IMAGE_FILE_SIZE_BYTES,
  MAX_IMAGE_FILE_SIZE_MB,
  MIN_DESCRIPTION_LENGTH,
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  ONLY_NUMBERS_REGEX,
} from '@/constants';
import { z } from 'zod';
import { getCurrLocale } from '@/utils/language';

// ─── Shared text helpers ──────────────────────────────────────────────────────

type TextFieldLimits = {
  min?: number;
  max?: number;
};

const isAr = () => getCurrLocale() === 'ar';
const isIt = () => getCurrLocale() === 'it';

/** Trims edges and collapses repeated internal spaces while preserving line breaks. */
export function normalizeText(value: string): string {
  return value
    .split('\n')
    .map(line => line.replace(/ {2,}/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n'); // Limit to max 2 consecutive line breaks
}

function addTextValidationIssues(
  value: string,
  locale: 'en' | 'ar' | 'it',
  min: number,
  max: number,
  ctx: z.RefinementCtx,
) {
  const charsetRegex =
    locale === 'en' ? ENGLISH_TEXT_REGEX : locale === 'ar' ? ARABIC_TEXT_REGEX : ITALIAN_TEXT_REGEX;

  if (!charsetRegex.test(value)) {
    let message = '';
    if (locale === 'en') {
      message = isAr()
        ? 'يجب أن يحتوي الحقل على أحرف إنجليزية فقط.'
        : isIt()
          ? 'Il campo deve contenere solo caratteri inglesi.'
          : 'Field must contain English characters only.';
    } else if (locale === 'ar') {
      message = isAr()
        ? 'يجب أن يحتوي الحقل على أحرف عربية فقط.'
        : isIt()
          ? 'Il campo deve contenere solo caratteri arabi.'
          : 'Field must contain Arabic characters only.';
    } else {
      message = isAr()
        ? 'يجب أن يحتوي الحقل على أحرف إيطالية فقط.'
        : isIt()
          ? 'Il campo deve contenere solo caratteri italiani.'
          : 'Field must contain Italian characters only.';
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message,
    });
  }

  if (ONLY_NUMBERS_REGEX.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: isAr()
        ? 'لا يمكن أن يحتوي الحقل على أرقام فقط.'
        : isIt()
          ? 'Il campo non può contenere solo numeri.'
          : 'Field cannot contain only numbers.',
    });
  }

  if (value.length < min) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: isAr()
        ? `يجب أن يكون الحقل ${min} أحرف على الأقل.`
        : isIt()
          ? `Il campo deve contenere almeno ${min} caratteri.`
          : `Field must be at least ${min} characters.`,
    });
  }

  if (value.length > max) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: isAr()
        ? `يجب ألا يتجاوز الحقل ${max} حرفًا.`
        : isIt()
          ? `Il campo non deve superare ${max} caratteri.`
          : `Field must not exceed ${max} characters.`,
    });
  }
}

function buildTextSchema(locale: 'en' | 'ar' | 'it', options?: TextFieldLimits) {
  const min = options?.min ?? 1;
  const max = options?.max ?? 255;

  return z
    .string({
      error: () => ({
        message: isAr() ? 'الحقل مطلوب.' : isIt() ? 'Il campo è obbligatorio.' : 'Field is required.',
      }),
    })
    .transform(normalizeText)
    .pipe(
      z.string().superRefine((value, ctx) => {
        if (value.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: isAr() ? 'الحقل مطلوب.' : isIt() ? 'Il campo è obbligatorio.' : 'Field is required.',
          });
          return;
        }

        addTextValidationIssues(value, locale, min, max, ctx);
      }),
    );
}

function buildOptionalTextSchema(locale: 'en' | 'ar' | 'it', options?: TextFieldLimits) {
  const min = options?.min ?? 1;
  const max = options?.max ?? 255;

  return z
    .string()
    .transform(normalizeText)
    .pipe(
      z.union([
        z.literal(''),
        z.string().superRefine((value, ctx) => {
          addTextValidationIssues(value, locale, min, max, ctx);
        }),
      ]),
    );
}

// ─── Bilingual title / description schemas ────────────────────────────────────

function getEnglishTextSchema(options?: TextFieldLimits) {
  return buildTextSchema('en', options);
}

function getArabicTextSchema(options?: TextFieldLimits) {
  return buildTextSchema('ar', options);
}

function getItalianTextSchema(options?: TextFieldLimits) {
  return buildTextSchema('it', options);
}

function getOptionalEnglishTextSchema(options?: TextFieldLimits) {
  return buildOptionalTextSchema('en', options);
}

function getOptionalArabicTextSchema(options?: TextFieldLimits) {
  return buildOptionalTextSchema('ar', options);
}

function getOptionalItalianTextSchema(options?: TextFieldLimits) {
  return buildOptionalTextSchema('it', options);
}

function getTitleEnSchema(options?: TextFieldLimits) {
  return getEnglishTextSchema({ min: MIN_TITLE_LENGTH, max: MAX_TITLE_LENGTH, ...options });
}

function getTitleArSchema(options?: TextFieldLimits) {
  return getArabicTextSchema({ min: MIN_TITLE_LENGTH, max: MAX_TITLE_LENGTH, ...options });
}

function getTitleItSchema(options?: TextFieldLimits) {
  return getItalianTextSchema({ min: MIN_TITLE_LENGTH, max: MAX_TITLE_LENGTH, ...options });
}

function getOptionalTitleEnSchema(options?: TextFieldLimits) {
  return getOptionalEnglishTextSchema({
    min: MIN_TITLE_LENGTH,
    max: MAX_TITLE_LENGTH,
    ...options,
  });
}

function getOptionalTitleArSchema(options?: TextFieldLimits) {
  return getOptionalArabicTextSchema({
    min: MIN_TITLE_LENGTH,
    max: MAX_TITLE_LENGTH,
    ...options,
  });
}

function getOptionalTitleItSchema(options?: TextFieldLimits) {
  return getOptionalItalianTextSchema({
    min: MIN_TITLE_LENGTH,
    max: MAX_TITLE_LENGTH,
    ...options,
  });
}

function getDescriptionEnSchema(options?: TextFieldLimits) {
  return getEnglishTextSchema({
    min: MIN_DESCRIPTION_LENGTH,
    max: MAX_DESCRIPTION_LENGTH,
    ...options,
  });
}

function getDescriptionArSchema(options?: TextFieldLimits) {
  return getArabicTextSchema({
    min: MIN_DESCRIPTION_LENGTH,
    max: MAX_DESCRIPTION_LENGTH,
    ...options,
  });
}

function getDescriptionItSchema(options?: TextFieldLimits) {
  return getItalianTextSchema({
    min: MIN_DESCRIPTION_LENGTH,
    max: MAX_DESCRIPTION_LENGTH,
    ...options,
  });
}

function getOptionalDescriptionEnSchema(options?: TextFieldLimits) {
  return getOptionalEnglishTextSchema({
    min: MIN_DESCRIPTION_LENGTH,
    max: MAX_DESCRIPTION_LENGTH,
    ...options,
  });
}

function getOptionalDescriptionArSchema(options?: TextFieldLimits) {
  return getOptionalArabicTextSchema({
    min: MIN_DESCRIPTION_LENGTH,
    max: MAX_DESCRIPTION_LENGTH,
    ...options,
  });
}

function getOptionalDescriptionItSchema(options?: TextFieldLimits) {
  return getOptionalItalianTextSchema({
    min: MIN_DESCRIPTION_LENGTH,
    max: MAX_DESCRIPTION_LENGTH,
    ...options,
  });
}

export const titleEnSchema = getTitleEnSchema();
export const titleArSchema = getTitleArSchema();
export const titleItSchema = getTitleItSchema();
export const descriptionEnSchema = getDescriptionEnSchema();
export const descriptionArSchema = getDescriptionArSchema();
export const descriptionItSchema = getDescriptionItSchema();
export const optionalTitleEnSchema = getOptionalTitleEnSchema();
export const optionalTitleArSchema = getOptionalTitleArSchema();
export const optionalTitleItSchema = getOptionalTitleItSchema();
export const optionalDescriptionEnSchema = getOptionalDescriptionEnSchema();
export const optionalDescriptionArSchema = getOptionalDescriptionArSchema();
export const optionalDescriptionItSchema = getOptionalDescriptionItSchema();

// ─── Password ─────────────────────────────────────────────────────────────────

export function getPasswordSchema() {
  return z
    .string({
      error: () => ({
        message: isAr() ? 'كلمة المرور لا يمكن أن تكون فارغة.' : 'Password cannot be empty.',
      }),
    })
    .superRefine((value, ctx) => {
      if (!/^.{8,20}$/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: isAr()
            ? 'يجب أن تكون كلمة المرور بين 8 و 20 حرفًا.'
            : 'Password must be between 8 and 20 characters.',
        });
      }

      if (!/(?=.*[A-Z])/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: isAr()
            ? 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل.'
            : 'Password must contain at least one uppercase letter.',
        });
      }

      if (!/(?=.*[a-z])/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: isAr()
            ? 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل.'
            : 'Password must contain at least one lowercase letter.',
        });
      }

      if (!/(?=.*\d)/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: isAr()
            ? 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.'
            : 'Password must contain at least one digit.',
        });
      }

      if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: isAr()
            ? 'يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل.'
            : 'Password must contain at least one special character.',
        });
      }
    });
}

export const passwordSchema = getPasswordSchema();

// ─── Image file upload ────────────────────────────────────────────────────────

const IMAGE_FILE_SIGNATURES = {
  gif: [0x47, 0x49, 0x46],
  jpg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  webp: [0x52, 0x49, 0x46, 0x46],
} as const;

const hasBytesAtOffset = (bytes: Uint8Array, signature: readonly number[], offset = 0) =>
  signature.every((byte, index) => bytes[index + offset] === byte);

const getFileExtension = (file: File) => `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;

export async function isAcceptedImageFile(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  return (
    hasBytesAtOffset(bytes, IMAGE_FILE_SIGNATURES.png) ||
    hasBytesAtOffset(bytes, IMAGE_FILE_SIGNATURES.jpg) ||
    hasBytesAtOffset(bytes, IMAGE_FILE_SIGNATURES.gif) ||
    (hasBytesAtOffset(bytes, IMAGE_FILE_SIGNATURES.webp) &&
      hasBytesAtOffset(bytes, [0x57, 0x45, 0x42, 0x50], 8))
  );
}

export function getImageFileTypeErrorMessage(): string {
  return isAr()
    ? 'يجب أن يكون الملف بصيغة JPG أو PNG أو GIF أو WEBP.'
    : 'File must be JPG, PNG, GIF, or WEBP format.';
}

export function getImageFileSizeErrorMessage(): string {
  return isAr()
    ? `يجب ألا يتجاوز حجم الملف ${MAX_IMAGE_FILE_SIZE_MB} ميجابايت.`
    : `File must not exceed ${MAX_IMAGE_FILE_SIZE_MB}MB.`;
}

async function addImageFileValidationIssues(file: File, ctx: z.RefinementCtx) {
  if (!(await isAcceptedImageFile(file))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: getImageFileTypeErrorMessage(),
    });
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: getImageFileSizeErrorMessage(),
    });
  }
}

export function getImageFileSchema() {
  return z
    .instanceof(File, {
      error: () => ({
        message: isAr() ? 'الحقل مطلوب.' : 'Field is required.',
      }),
    })
    .superRefine(async (file, ctx) => {
      await addImageFileValidationIssues(file, ctx);
    });
}

export function getNullableImageFileSchema() {
  return z
    .union([z.instanceof(File), z.null()])
    .superRefine(async (file, ctx) => {
      if (!file) return;

      await addImageFileValidationIssues(file, ctx);
    });
}

export const imageFileSchema = getImageFileSchema();
export const nullableImageFileSchema = getNullableImageFileSchema();

// ─── Document file upload ─────────────────────────────────────────────────────

const DOCUMENT_FILE_SIGNATURES = {
  doc: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
  docx: [0x50, 0x4b, 0x03, 0x04],
  pdf: [0x25, 0x50, 0x44, 0x46],
} as const;

export async function isAcceptedDocumentFile(file: File): Promise<boolean> {
  const extension = getFileExtension(file);
  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (!ACCEPTED_DOCUMENT_FILE_EXTENSIONS.includes(extension as '.pdf' | '.doc' | '.docx')) {
    return false;
  }

  if (extension === '.pdf') return hasBytesAtOffset(bytes, DOCUMENT_FILE_SIGNATURES.pdf);
  if (extension === '.doc') return hasBytesAtOffset(bytes, DOCUMENT_FILE_SIGNATURES.doc);

  return hasBytesAtOffset(bytes, DOCUMENT_FILE_SIGNATURES.docx);
}

export function getDocumentFileTypeErrorMessage(): string {
  return isAr()
    ? 'يجب أن يكون الملف بصيغة PDF أو DOC أو DOCX.'
    : 'File must be PDF, DOC, or DOCX format.';
}

export function getDocumentFileSizeErrorMessage(): string {
  return isAr()
    ? `يجب ألا يتجاوز حجم الملف ${MAX_DOCUMENT_FILE_SIZE_MB} ميجابايت.`
    : `File must not exceed ${MAX_DOCUMENT_FILE_SIZE_MB}MB.`;
}

async function addDocumentFileValidationIssues(file: File, ctx: z.RefinementCtx) {
  if (!(await isAcceptedDocumentFile(file))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: getDocumentFileTypeErrorMessage(),
    });
  }

  if (file.size > MAX_DOCUMENT_FILE_SIZE_BYTES) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: getDocumentFileSizeErrorMessage(),
    });
  }
}

export function getDocumentFileSchema() {
  return z
    .instanceof(File, {
      error: () => ({
        message: isAr() ? 'الحقل مطلوب.' : 'Field is required.',
      }),
    })
    .superRefine(async (file, ctx) => {
      await addDocumentFileValidationIssues(file, ctx);
    });
}

export function getNullableDocumentFileSchema() {
  return z
    .union([z.instanceof(File), z.null()])
    .superRefine(async (file, ctx) => {
      if (!file) return;

      await addDocumentFileValidationIssues(file, ctx);
    });
}

export const documentFileSchema = getDocumentFileSchema();
export const nullableDocumentFileSchema = getNullableDocumentFileSchema();

export const noLeadingSpacesSchema = z.string().refine((val) => val.trim().length > 0, {
  message: 'Input cannot be empty or start with spaces',
});

export const noNumbersSchema = z.string().refine((val) => !/\d/.test(val), {
  message: 'Input cannot contain numbers',
});
