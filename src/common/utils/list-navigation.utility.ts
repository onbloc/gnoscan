/** Wraps around at both ends. From no selection, Down goes to the first option and Up to the last. */
export const getNextOptionIndex = (index: number, step: 1 | -1, count: number) => {
  if (index === -1 && step === -1) return count - 1;
  return (index + step + count) % count;
};
