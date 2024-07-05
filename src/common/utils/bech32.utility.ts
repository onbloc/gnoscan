import crypto from 'crypto';
import {bech32} from 'bech32';

export function toBech32Address(prefix: string, data: number[]): string {
  return bech32.encode(prefix, bech32.toWords(data));
}

export function toBech32AddressByPackagePath(prefix: string, packagePath: string): string {
  const bytes = Buffer.from('pkgPath:' + packagePath, 'utf-8');
  const hash = crypto.createHash('sha256').setEncoding('utf-8').update(bytes).digest();
  return bech32.encode(prefix, bech32.toWords(hash.slice(0, 20)));
}
