import { blake2b } from "blakejs";

/**
 * Generates a BLAKE2b hash of the provided value using the given secret as a key.
 *
 * @param value - The input string to be hashed.
 * @param secret - The secret key used for keyed hashing.
 * @returns The base64-encoded BLAKE2b hash of the input value.
 */
export default (value: string, secret: string): string => {
    const key = Uint8Array.from(atob(secret), c => c.charCodeAt(0));
    const input = new TextEncoder().encode(value);
    const hash = blake2b(input, key, 64);

    return Buffer.from(hash).toString('base64');
}