/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";

export interface TimeStamp {
  time: string;
  passedTime?: string;
}

const getDateUtcToLocal = (d: any) => {
  const hasTimezone = `${d}`.includes("Z");
  const timezoneOffset = new Date().getTimezoneOffset();
  let currentDate = dayjs(d);
  if (!hasTimezone) {
    currentDate = currentDate.subtract(timezoneOffset, "minutes");
  }
  return {
    value: currentDate.format("YYYY-MM-DD HH:mm:ss"),
    offsetHours: -timezoneOffset / 60,
  };
};

export const getDateDiff = (d: any) => {
  const now = dayjs();
  const target = dayjs(getDateUtcToLocal(d).value);
  const diff = now.diff(target, "seconds");
  const diffM = now.diff(target, "minute");
  const diffH = now.diff(target, "hours");
  const diffD = now.diff(target, "day");

  if (diff < 60) return "less than a minute ago";
  if (diffM < 2) return "1 min ago";
  if (diffM >= 2 && diffM <= 59) return `${diffM} mins ago`;
  if (diffM >= 60 && diffM <= 119) return "1 hour ago";
  if (diffH >= 2 && diffH <= 23) return `${diffH} hours ago`;
  if (diffD >= 1 && diffD < 2) return "1 day ago";
  if (diffD >= 2 && diffD < 31) return `${diffD} days ago`;
  if (diffD >= 31 && diffD < 61) return "1 month ago";
  if (diffD >= 61 && diffD < 365) return `${Math.floor(diffD / 30)} months ago`;
  if (diffD >= 365 && diffD < 730) return "1 year ago";
  if (diffD >= 730) return `${Math.floor(diffD / 365)} years ago`;
};

export const getLocalDateString = (d: any) => {
  const { value, offsetHours } = getDateUtcToLocal(d);
  const sign = offsetHours > 0 ? "+" : "-";
  const offsetHoursString = offsetHours === 0 ? "UTC" : `UTC${sign}${Math.abs(offsetHours)}`;
  return `${value} (${offsetHoursString})`;
};

export const dateToStr = (date: Date): string => {
  const monthStr = `00${date.getMonth() + 1}`.slice(-2);
  const dateStr = `00${date.getDate()}`.slice(-2);
  return [date.getFullYear(), monthStr, dateStr].join("-");
};

type DateInput = string | Date | null | undefined;

export const formatDate = (date: DateInput): string => {
  if (!date) return "-";

  const dateObject = new Date(date);

  const isValid = dateObject instanceof Date && !isNaN(dateObject.getTime());

  return isValid ? dateObject.toISOString() : "-";
};

export const getTimeStamp = (date: string): TimeStamp => {
  if (!date) return { time: "-", passedTime: "-" };
  return {
    time: getLocalDateString(date),
    passedTime: getDateDiff(date),
  };
};
