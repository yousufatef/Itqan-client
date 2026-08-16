import { format } from 'date-fns';
import { arEG } from 'date-fns/locale/ar-EG';
import { enGB } from 'date-fns/locale/en-GB';

type DateFormatVariant = 'long' | 'short';

const PATTERNS: Record<DateFormatVariant, string> = {
  long: 'dd MMMM yyyy',
  short: 'd MMM yyyy',
};

const AR_SHORT_MONTHS: readonly string[] = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

const getLocale = (isEnglish: boolean) => (isEnglish ? enGB : arEG);

export const formatLocalizedDate = (
  date?: string,
  isEnglish = true,
  variant: DateFormatVariant = 'long',
): string => {
  if (!date) return '-';

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return '-';

  if (!isEnglish && variant === 'short') {
    const day = format(parsed, 'd', { locale: arEG });
    const year = format(parsed, 'yyyy', { locale: arEG });
    const month = AR_SHORT_MONTHS[parsed.getMonth()];
    return `${day} ${month} ${year}`;
  }

  return format(parsed, PATTERNS[variant], { locale: getLocale(isEnglish) });
};

/** Full month name — used in tables */
export const formatDate = (date?: string, isEnglish = true) =>
  formatLocalizedDate(date, isEnglish, 'long');

/** Short month — used in cards */
export const formatDateShort = (date: string, isEnglish: boolean) =>
  formatLocalizedDate(date, isEnglish, 'short');

export const formatTime = (date?: string, isEnglish = true): string => {
  if (!date) return '-';

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return '-';

  return format(parsed, 'hh:mm a', {
    locale: isEnglish ? enGB : arEG,
  }).toUpperCase();
};

export const formatDateTime = (
  date: string | undefined,
  time: string | undefined,
  isEnglish: boolean
) => {
  if (!date && !time) return '-';

  const [day, month, year] = (date || '').split('-');

  const dateObject = new Date(
    `${year}-${month}-${day}T${time || '00:00'}`
  );

  const formattedDate = new Intl.DateTimeFormat(
    isEnglish ? 'en-US' : 'it-IT',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  ).format(dateObject);

  const formattedTime = time
    ? new Intl.DateTimeFormat(
      isEnglish ? 'en-US' : 'it-IT',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
    ).format(dateObject)
    : '';

  return formattedTime
    ? `${formattedDate} · ${formattedTime}`
    : formattedDate;
};