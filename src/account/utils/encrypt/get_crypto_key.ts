/*import cripto from 'crypto';

export default async (secret: string): Promise<CryptoKey> => {

    console.log(secret);
    

    const keyData = Uint8Array.from(atob(secret), c => c.charCodeAt(0));
    const validLengths = [16, 24, 32];

    if (!validLengths.includes(keyData.length))
        throw new Error('the secret key must be 16, 24, or 32 bytes long');

    const algorithm: cripto.webcrypto.AlgorithmIdentifier = {
        name: 'AES-GCM',
    }

    const permissions: KeyUsage[] = ['encrypt', 'decrypt'];
    
    return await cripto.subtle.importKey('raw', keyData, algorithm, false, permissions);
}*/

import { webcrypto } from 'crypto';

export default async (secret: string): Promise<CryptoKey> => {
  if (!secret) {
    throw new Error('Secret is undefined. Did you forget to set the env variable?');
  }

  // decodifica base64 de forma segura en Node
  const keyBuffer = Buffer.from(secret, 'base64');
  const validLengths = [16, 24, 32];  

  if (!validLengths.includes(keyBuffer.length)) {
    throw new Error('The secret key must be 16, 24, or 32 bytes long');
  }

  const algorithm = { name: 'AES-GCM' };
  const permissions: KeyUsage[] = ['encrypt', 'decrypt'];

  return await webcrypto.subtle.importKey(
    'raw',
    keyBuffer,
    algorithm,
    false,
    permissions
  );
};