export const getItem = (key: string) => localStorage.getItem(key);

export const setItem = (key: string, value: any) => localStorage.setItem(key, value);

export const removeItem = (key: string) => localStorage.removeItem(key);

export const exists = (key: string) => {
  const value = getItem(key);
  if (!value) {
    return false;
  }
  return true;
};
