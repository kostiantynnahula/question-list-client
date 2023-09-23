export const ucfirst = (value: string): string => {
  if (!value.length) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}