import cripto from 'crypto';

/**
 * Encrypts a given string value using the provided AES-GCM secret key.
 *
 * @param value - The plaintext string to be encrypted.
 * @param secret - The CryptoKey used for AES-GCM encryption.
 * @returns A promise that resolves to an `EncriptedData` object containing the base64-encoded initialization vector (`iv`)
 *          and the base64-encoded encrypted value (`encripted`).
 *
 * @throws Will throw an error if encryption fails.
 */
export default async (value: string, secret: CryptoKey) => {
    const iv = cripto.getRandomValues(new Uint8Array(12))
    const encoder = new TextEncoder();
    const encondedValue = encoder.encode(value);

    const algoprithm: cripto.webcrypto.AesGcmParams = {
        name: 'AES-GCM',
        iv: iv,
    }

    const cipherValue = await cripto.subtle.encrypt(algoprithm, secret, encondedValue);

    const encryptedBuffer = new Uint8Array(iv.length + cipherValue.byteLength);
    encryptedBuffer.set(iv, 0);
    encryptedBuffer.set(new Uint8Array(cipherValue), iv.length);

    return Buffer.from(encryptedBuffer).toString('base64');
}