export type TimePeriod = 'AM' | 'PM';

export type ParsedTime = {
  hour: number | null;
  minute: number | null;
  period: TimePeriod;
};

const TIME_12H_PATTERN = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
const TIME_24H_PATTERN = /^(\d{1,2}):(\d{2})(?::\d{2})?$/;

export function parseTimeString(value: string | undefined | null): ParsedTime {
  if (!value?.trim()) {
    return { hour: null, minute: null, period: 'AM' };
  }

  const trimmed = value.trim();

  const match12 = trimmed.match(TIME_12H_PATTERN);
  if (match12) {
    const hour = Number(match12[1]);
    const minute = Number(match12[2]);
    const period = match12[3].toUpperCase() as TimePeriod;

    if (!isValidHour(hour) || !isValidMinute(minute)) {
      return { hour: null, minute: null, period: 'AM' };
    }

    return { hour, minute, period };
  }

  const match24 = trimmed.match(TIME_24H_PATTERN);
  if (match24) {
    const rawHour = Number(match24[1]);
    const minute = Number(match24[2]);

    if (!Number.isInteger(rawHour) || rawHour < 0 || rawHour > 23 || !isValidMinute(minute)) {
      return { hour: null, minute: null, period: 'AM' };
    }

    const period: TimePeriod = rawHour >= 12 ? 'PM' : 'AM';
    let hour = rawHour % 12;
    if (hour === 0) hour = 12;

    return { hour, minute, period };
  }

  return { hour: null, minute: null, period: 'AM' };
}

export function formatTimeString({ hour, minute, period }: ParsedTime): string {
  if (hour === null || minute === null) return '';
  return `${hour}:${String(minute).padStart(2, '0')} ${period}`;
}

export function isValidHour(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 12;
}

export function isValidMinute(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 59;
}

export function normalizeHourInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || !isValidHour(parsed)) return null;

  return parsed;
}

export function normalizeMinuteInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || !isValidMinute(parsed)) return null;

  return parsed;
}

export function formatHourDisplay(hour: number | null): string {
  return hour === null ? '' : String(hour);
}

export function formatMinuteDisplay(minute: number | null): string {
  return minute === null ? '' : String(minute).padStart(2, '0');
}

export function formatTo24HourTime(value: string | undefined | null, includeSeconds = false): string {
  const parsed = parseTimeString(value);
  if (parsed.hour === null || parsed.minute === null) return value ?? '';

  let hour24 = parsed.hour;
  if (parsed.period === 'PM' && hour24 < 12) {
    hour24 += 12;
  } else if (parsed.period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }

  const hh = String(hour24).padStart(2, '0');
  const mm = String(parsed.minute).padStart(2, '0');
  return includeSeconds ? `${hh}:${mm}:00` : `${hh}:${mm}`;
}
