import { ValuesType } from "utility-types";

export const EVENT_TABLE_PAGE_SIZE = 20;

export const DEVICE_TYPE = {
  DESKTOP: "desktop",
  TABLET: "tablet",
  MOBILE: "mobile",
} as const;

export type DEVICE_TYPE = ValuesType<typeof DEVICE_TYPE>;

export const DEVICE_SIZE_THRESHOLDS = {
  DESKTOP: 1280,
  TABLET: 768,
  MOBILE: 320,
};

export const media = {
  DESKTOP: `@media (min-width: ${DEVICE_SIZE_THRESHOLDS.DESKTOP}px)`,
  TABLET: `@media (min-width: ${DEVICE_SIZE_THRESHOLDS.TABLET}px) and (max-width: ${
    DEVICE_SIZE_THRESHOLDS.DESKTOP - 1
  }px)`,
  MOBILE: `@media (max-width: ${DEVICE_SIZE_THRESHOLDS.TABLET - 1}px)`,
};
