export const convertToNumberOrDate = (value: any): number | Date => {
  const parsedDate = Date.parse(value);
  return Number.isNaN(parsedDate) ? Number(value) : new Date(parsedDate);
};
