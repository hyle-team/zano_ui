import { extractErrorCode } from './extract-error-code';

describe('extractErrorCode', () => {
    it('should extract part before colon when colon is present', () => {
        const input = 'WALLET_RPC_ERROR_CODE_NOT_ENOUGH_MONEY: detailed info here';
        expect(extractErrorCode(input)).toBe('WALLET_RPC_ERROR_CODE_NOT_ENOUGH_MONEY');
    });

    it('should return full trimmed string when no colon is present', () => {
        const input = ' WALLET_RPC_ERROR_CODE_NOT_ENOUGH_MONEY ';
        expect(extractErrorCode(input)).toBe('WALLET_RPC_ERROR_CODE_NOT_ENOUGH_MONEY');
    });

    it('should return non-string values unchanged', () => {
        const obj = { message: 'error' };
        expect(extractErrorCode(obj)).toBe(obj);
        expect(extractErrorCode(null)).toBe(null);
        expect(extractErrorCode(undefined)).toBe(undefined);
        expect(extractErrorCode(123)).toBe(123);
    });
});
