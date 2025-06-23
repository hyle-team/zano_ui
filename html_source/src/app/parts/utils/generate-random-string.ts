export const generateRandomString = (length = 40): string => {
    const array: Uint8Array = new Uint8Array(length);
    window.crypto.getRandomValues(array);

    const regularArray: number[] = Array.from(array);

    return btoa(String.fromCharCode.apply(null, regularArray));
};
