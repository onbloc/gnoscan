export const toGnot = (value: number, denom: string) => {
  return {
    value: valueConvert(value, denom),
    denom: denomConvert(denom),
  };
};

export const denomConvert = (denom: string) => {
  return isUgnot(denom) ? 'GNOddT' : `${denom}`.toUpperCase().trim();
};

export const valueConvert = (value: number, denom: string) => {
  return isUgnot(denom) ? value / 1000000 : value;
};

const isUgnot = (denom: string) => {
  return ['ugnot', 'UGNOT'].includes(denom);
};
