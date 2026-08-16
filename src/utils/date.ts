import { arMonths, enMonths } from '@/constants';

export { formatDate, formatDateShort, formatLocalizedDate } from './FormatDate';

export const currentDate = (isEnglish: boolean): string => {
  const d = new Date();
  const day = d.getDate();
  const year = d.getFullYear();
  const month = isEnglish ? enMonths[d.getMonth()] : arMonths[d.getMonth()];
  return `${day} ${month} ${year}`;
};
