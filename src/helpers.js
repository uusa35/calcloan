export const parseArabicChar = (str) => {
  return Number(
    str
      .replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => d.charCodeAt(0) - 1632)
      .replace(/٫/g, '.'),
  );
};

export const getDecimals = (value) => {
  if (value % 1 != 0) {
    return value.toString().split('.')[1];
  }
  return 0;
};

export const numberWithCommas = (x) => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const toDecimalPlace = (value) => {
  return value.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
};
