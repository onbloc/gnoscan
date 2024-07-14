export function parseTokenAmount(tokenAmount: string, denomination = 'ugnot'): number {
  const pattern = new RegExp(`^(\\d+)${denomination}$`);
  const match = tokenAmount.match(pattern);

  return match ? parseInt(match[1], 10) : 0;
}
