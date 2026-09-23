import { isAxiosError } from "axios";

export const isStatisticsNotReady = (error: unknown): boolean => isAxiosError(error) && error.response?.status === 404;

export const retryStatisticsQuery = (failureCount: number, error: unknown): boolean =>
  !isStatisticsNotReady(error) && failureCount < 3;
