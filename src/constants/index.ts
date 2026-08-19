export const TOKEN = 'Itqan_token';
export const REFRESH_TOKEN = 'Itqan_refresh_token';
export const USER_VERIFIED = 'Itqan_user_verified';

export const MIN_TITLE_LENGTH = 2;
export const MAX_TITLE_LENGTH = 100;
export const MIN_DESCRIPTION_LENGTH = 5;
export const MAX_DESCRIPTION_LENGTH = 2000;

export const MAX_IMAGE_FILE_SIZE_MB = 5;
export const MAX_IMAGE_FILE_SIZE_BYTES = MAX_IMAGE_FILE_SIZE_MB * 1024 * 1024;
export const IMAGE_COMPRESSION_MAX_SIZE_MB = 1;
export const IMAGE_COMPRESSION_MAX_WIDTH_OR_HEIGHT = 1920;

export const MAX_DOCUMENT_FILE_SIZE_MB = 5;
export const MAX_DOCUMENT_FILE_SIZE_BYTES = MAX_DOCUMENT_FILE_SIZE_MB * 1024 * 1024;

/** JPG, PNG, GIF, or WEBP */
export const ACCEPTED_IMAGE_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;
export const ACCEPTED_IMAGE_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'] as const;

/** PDF, DOC, or DOCX */
export const ACCEPTED_DOCUMENT_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;
export const ACCEPTED_DOCUMENT_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

/** Latin letters, digits, and common punctuation. */
export const ENGLISH_TEXT_REGEX = /^[A-Za-z0-9\s.,!?'"()\-:;&•●▪◦‣]+$/;
/** Italian letters, digits, and common punctuation. */
export const ITALIAN_TEXT_REGEX = /^[A-Za-z0-9\s.,!?'"()\-:;&•●▪◦‣àèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]+$/;
/** Arabic script, digits, and common punctuation. */
export const ARABIC_TEXT_REGEX =
  /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9\s.,!?'"()\-:;&•●▪◦‣]+$/;

/** ASCII and Arabic-Indic digits only. */
export const ONLY_NUMBERS_REGEX = /^[\d\u0660-\u0669\u06F0-\u06F9]+$/;

export const arMonths = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];
export const enMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
