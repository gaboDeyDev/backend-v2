export function fillWithZeros(value: string, length: number): string {
  return value.padStart(length, '0');
}