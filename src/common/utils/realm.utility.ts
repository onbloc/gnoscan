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
  owner: string;
} | null {
  const constructRegexp = /\((.*)\)/;
  const constructFunctionName = '.NewAdminToken';
  const functionRegexp = /([a-zA-Z0-9])+/;
  const adminRegexp = /(\w+)\s+std\.Address\s*=\s*"([^"]*)"/;

  let grc20Info: {
    name: string;
    symbol: string;
    decimals: number;
    owner: string;
  } | null = null;
  let owner: string | null = '';
  const functions: string[] = [];

  for (const line of file.split('\n')) {
    const trimLine = line.replaceAll('\t', '').trim();

    if (!owner) {
      const adminParams = trimLine.match(adminRegexp);
      if (adminParams && adminParams.length > 2) {
        owner = adminParams[2];
      }
    }

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
            owner: '',
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

  if (!grc20Info || !owner) {
    return null;
  }

  if (!GRC20_FUNCTIONS.every(func => functions.includes(func))) {
    return null;
  }
  return {...grc20Info, owner};
}

export function parseBankerGRC20InfoByFile(file: string): {
  name: string;
  symbol: string;
  decimals: number;
  owner: string;
} | null {
  const addressPattern = /ownable\.NewWithAddress\("([a-z0-9]+)"\)/;
  const bankerPattern = /grc20\.NewBanker\("([^"]+)",\s*"([^"]+)",\s*(\d+)\)/;

  try {
    const addressMatch = file.match(addressPattern);
    const address = addressMatch ? addressMatch[1] : null;

    const bankerMatch = file.match(bankerPattern);
    const bankerInfo = bankerMatch
      ? {
          name: bankerMatch[1],
          symbol: bankerMatch[2],
          decimals: parseInt(bankerMatch[3], 10),
        }
      : null;

    if (!bankerInfo || !address) {
      return null;
    }

    return {
      name: bankerInfo.name,
      symbol: bankerInfo.symbol,
      decimals: bankerInfo.decimals,
      owner: address,
    };
  } catch {
    return null;
  }
}
