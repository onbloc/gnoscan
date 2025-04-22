export const makeRPCUrl = (url: string) => {
  const isSSL = url.startsWith("https://") || url.startsWith("wss://");
  const urlData = url.split("://");
  const uri = urlData[urlData.length - 1];

  if (urlData.length < 2 || isSSL) {
    return {
      httpUrl: `https://${uri}`,
      wsUrl: `wss://${uri}`,
    };
  }

  return {
    httpUrl: `http://${uri}`,
    wsUrl: `ws://${uri}`,
  };
};

/**
 * Converts a string into base64 representation
 * @param {string} str the raw string
 */
export const stringToBase64 = (str: string): string => {
  const buffer = Buffer.from(str, "utf-8");

  return buffer.toString("base64");
};

/**
 * Prepares the VM ABCI query params by concatenating them
 * with characters separation and encoding them to base64
 * `evaluateExpression` uses the "." character to separate parameters.
 * `getRenderOutput` uses the ":" character to separate parameters.
 * @param {string[]} params the params for the ABCI call
 * @param {string} separator the separator for ABCI call parameters (default: "")
 */
export const prepareVMABCIQueryWithSeparator = (params: string[], separator: string): string => {
  if (params.length == 1) {
    return stringToBase64(params[0]);
  }

  return stringToBase64(params.join(separator));
};

/**
 * Prepares the VM ABCI query parameters by concatenating characters and encoding them with base64.
 * @param {string[]} params the params for the ABCI call
 */
export const prepareVMABCIQuery = (params: string[]): string => {
  return prepareVMABCIQueryWithSeparator(params, "");
};

/**
 * Prepare the VM ABCI `evaluateExpression` query parameters by concatenating them
 * with the "." character delimiter and encoding them with base64.
 * @param {string[]} params the params for the ABCI call
 */
export const prepareVMABCIEvaluateExpressionQuery = (params: string[]): string => {
  return prepareVMABCIQueryWithSeparator(params, ".");
};

/**
 * Prepare the VM ABCI `render` query parameters by concatenating them
 * with the ":" character delimiter and encoding them with base64.
 * @param {string[]} params the params for the ABCI call
 */
export const prepareVMABCIRenderQuery = (params: string[]): string => {
  return prepareVMABCIQueryWithSeparator(params, ":");
};

export const extractStringFromResponse = (abciData: string | null): string => {
  // Make sure the response is initialized
  if (!abciData) {
    throw new Error("ABCI response is not initialized");
  }

  // Extract the balances
  return Buffer.from(abciData, "base64").toString();
};

export const parseABCIQueryNumberResponse = (abciData: string | null): number => {
  const value = extractStringFromResponse(abciData);
  const regex = /\d+/;
  const match = value.match(regex);

  if (match) {
    try {
      const value = match[0];
      return parseInt(value);
    } catch {
      return 0;
    }
  }
  return 0;
};
