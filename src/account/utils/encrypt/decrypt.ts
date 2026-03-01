import cripto from 'crypto';

/**
 * Decrypts a given base64-encoded string using AES-GCM algorithm.
 *
 * @param value - The base64-encoded encrypted data to decrypt.
 * @param iv - The base64-encoded initialization vector used during encryption.
 * @param secret - The CryptoKey used for decryption.
 * @returns A promise that resolves to the decrypted plaintext string.
 * @throws Will throw an error if decryption fails.
 */
export default async (value: string, secret: CryptoKey):Promise<string> => {

    const encryptedBuffer = Buffer.from(value, 'base64');
    const iv = encryptedBuffer.subarray(0, 12); // los primeros 12 bytes
    const data = encryptedBuffer.subarray(12);

    const algoprithm: cripto.webcrypto.AesGcmParams = {
        name: 'AES-GCM',
        iv: iv,
    }

    const decripted = await cripto.subtle.decrypt(algoprithm, secret, data);
    const decoder = new TextDecoder();

    return decoder.decode(decripted);
}