export const GRC20_FUNCTIONS = [
  'TotalSupply',
  'BalanceOf',
  'Transfer',
  'Allowance',
  'Approve',
  'TransferFrom',
];

export function parseGRC20InfoByFile(file: string): {
  name: string;
  symbol: string;
  decimals: number;
} | null {
  const constructRegexp = /\((.*)\)/;
  const constructFunctionName = '.NewAdminToken';
  const functionRegexp = /([a-zA-Z0-9])+/;

  let grc20Info: {
    name: string;
    symbol: string;
    decimals: number;
  } | null = null;
  const functions: string[] = [];

  for (const line of file.split('\n')) {
    const trimLine = line.replaceAll('\t', '').trim();

    if (!grc20Info && trimLine.includes(constructFunctionName)) {
      const exec = constructRegexp.exec(trimLine);
      if (exec && exec.length > 1) {
        const paramStr = exec[1].replaceAll('"', '');
        const params = paramStr.split(',').map(param => param.trim());

        if (params.length > 2) {
          grc20Info = {
            name: params[0],
            symbol: params[1],
            decimals: Number(params[2]),
          };
        }
      }
    }

    if (trimLine.startsWith('func')) {
      const results = trimLine.replace('func', '').match(functionRegexp);
      const functionName = results?.[0];
      if (functionName) {
        functions.push(functionName);
      }
    }
  }

  if (!grc20Info) {
    return null;
  }

  if (!GRC20_FUNCTIONS.every(func => functions.includes(func))) {
    return null;
  }
  return grc20Info;
}
