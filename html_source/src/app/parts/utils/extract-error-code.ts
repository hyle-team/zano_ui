export function extractErrorCode<T>(value: T): T | string {
    if (typeof value !== 'string') {
        return value;
    }
    const colonIndex = value.indexOf(':');
    if (colonIndex !== -1) {
        return value.substring(0, colonIndex).trim();
    }
    return value.trim();
}
