export const GNOSTUDIO_BASE_URL = "https://gno.studio" as const;

// template variable is [GNOWEB_URL] and [PACKAGE_POST_PATH]
export const GNOWEB_REALM_TEMPLATE = "[GNOWEB_URL][PACKAGE_POST_PATH]" as const;

// template variable is [PACKAGE_PATH] and [NETWORK]
export const GNOSTUDIO_REALM_TEMPLATE = `${GNOSTUDIO_BASE_URL}/connect/view/[PACKAGE_PATH]?network=[NETWORK]` as const;

// template variable is [PACKAGE_PATH], [NETWORK] and [FUNCTION_NAME]
export const GNOSTUDIO_REALM_FUNCTION_TEMPLATE =
  `${GNOSTUDIO_BASE_URL}/connect/view/[PACKAGE_PATH]?network=[NETWORK]#[FUNCTION_NAME]` as const;
