import { customAlphabet } from 'nanoid';

// Use a URL-safe alphabet for IDs
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const nanoid = customAlphabet(alphabet, 8); // 8 characters should be sufficient for a lite pastebin

export function isValidUrl(urlString: string) {
    try {
        return Boolean(new URL(urlString));
    } catch (e) {
        return false;
    }
}
