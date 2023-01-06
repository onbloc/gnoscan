type StorageType = 'theme';

export const getItem = (key: StorageType) => localStorage.getItem(key);

export const setItem = (key: StorageType, value: any) => localStorage.setItem(key, `${value}`);

export const removeItem = (key: StorageType) => localStorage.removeItem(key);

export const exists = (key: StorageType) => {
  const value = getItem(key);
  if (!value) {
    return false;
  }
  return true;
};
