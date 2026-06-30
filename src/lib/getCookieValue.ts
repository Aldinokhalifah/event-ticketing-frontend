export function getCookieValue(name: string): string | undefined {
    if (typeof document === 'undefined') {
        return undefined;
    }

    const match = document.cookie.match(new RegExp(`(^|;)\\s*${encodeURIComponent(name)}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : undefined;
}