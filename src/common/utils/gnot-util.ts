export const toGnot = (value: number, denom: string) => {
  const denomValue = denom.toUpperCase().trim();
  const changedValue = {
    value,
    denom,
  };

  if (denomValue === 'GNOT') {
    changedValue.value = value;
    changedValue.denom = denomValue;
    return changedValue;
  }
  if (denomValue === 'UGNOT') {
    changedValue.value = value / 1000000;
    changedValue.denom = 'GNOT';
    return changedValue;
  }

  return changedValue;
};
