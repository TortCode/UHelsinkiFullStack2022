export const parseNumber = (str: string): number => {
  const n = Number(str);
  if (isNaN(n)) {
    throw new Error(`Invalid number: ${str}`);
  }
  return n;
};
