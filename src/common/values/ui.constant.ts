import { ValuesType } from "utility-types";

export const EVENT_TABLE_PAGE_SIZE = 20;

export const DEVICE_TYPE = {
  DESKTOP: "desktop",
  TABLET: "tablet",
  MOBILE: "mobile",
} as const;

export type DEVICE_TYPE = ValuesType<typeof DEVICE_TYPE>;
