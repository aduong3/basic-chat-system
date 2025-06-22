export const isAlphaNumeric = (str: string): boolean => {
  str = str.trim();
  return /^[a-zA-Z0-9]+$/.test(str);
};
