import {bech32} from 'bech32';

export function toBech32Address(prefix: string, data: number[]): string {
  return bech32.encode(prefix, bech32.toWords(data));
}
