export const isDev = process.env.NODE_ENV === 'development';

export const cwd = process.cwd();

export type BaseType = boolean | number | string | undefined | null;

function formatValue<T extends BaseType = string>(
  key: string,
  defaultValue: T,
  callback?: (value: string) => T,
): T {
  const value: string | undefined = process.env[key];
  if (typeof value === 'undefined') return defaultValue;

  if (!callback) return value as unknown as T;

  try {
    return callback(value);
  } catch (error) {
    console.error(`Error parsing environment variable "${key}":`, error);
    return defaultValue;
  }
}

export function env(key: string, defaultValue: string = ''): string {
  return formatValue<string>(key, defaultValue);
}

export function envString(key: string, defaultValue: string = ''): string {
  return formatValue<string>(key, defaultValue);
}

export function envNumber(key: string, defaultValue: number = 0): number {
  return formatValue<number>(key, defaultValue, (value) => {
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      throw new Error(`${key} environment variable is not a valid number`);
    }
    return parsedValue;
  });
}

export function envBoolean(
  key: string,
  defaultValue: boolean = false,
): boolean {
  return formatValue<boolean>(key, defaultValue, (value) => {
    const parsedValue = JSON.parse(value.toLowerCase());
    if (typeof parsedValue !== 'boolean') {
      throw new Error(`${key} environment variable is not a valid boolean`);
    }
    return parsedValue;
  });
}
