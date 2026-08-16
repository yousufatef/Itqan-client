const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

export const trimStringValues = <T>(value: T): T => {
  if (typeof value === 'string') return value.trim() as T;
  if (Array.isArray(value)) return value.map((item) => trimStringValues(item)) as T;

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, trimStringValues(item)]),
    ) as T;
  }

  return value;
};

export const InputTrimmer = (value: unknown) => {
  if (typeof value !== 'string') return value;

  return value
    .split('\n')
    .map((line) => line.replace(/ {2,}/g, ' ').trimStart())
    .join('\n');
};
