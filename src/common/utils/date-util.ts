import dayjs from 'dayjs';

export const getDateDiff = (d: any) => {
  const now = dayjs();
  const target = dayjs(d);
  const diff = now.diff(target, 'seconds');
  const diffM = now.diff(target, 'minute');
  const diffH = now.diff(target, 'hours');
  const diffD = now.diff(target, 'day');
  if (diff < 60) return 'less than a minute ago';
  if (diffM >= 1 && diffM <= 59) return `${diffM} mins ago`;
  if (diffM >= 60 && diffM <= 119) return '1 hour ago';
  if (diffH >= 2 && diffH <= 23) return `${diffH} hours ago`;
  if (diffD >= 1 && diffD < 2) return '1 day ago';
  if (diffD >= 2 && diffD < 31) return `${diffD} days ago`;
  if (diffD >= 31 && diffD < 61) return '1 month ago';
  if (diffD >= 61 && diffD < 365) return `${Math.floor(diffD / 30)} months ago`;
  if (diffD >= 365 && diffD < 730) return '1 year ago';
  if (diffD >= 730) return 'days/365 years ago';
};
