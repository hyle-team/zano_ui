import { ExtractErrorCodePipe } from './extract-error-code.pipe';

describe('ExtractErrorCodePipe', () => {
    let pipe: ExtractErrorCodePipe;

    beforeEach(() => {
        pipe = new ExtractErrorCodePipe();
    });

    it('should transform using extractErrorCode utility', () => {
        const input = 'WALLET_RPC_ERROR_CODE_NOT_ENOUGH_MONEY: detailed info';
        expect(pipe.transform(input)).toBe('WALLET_RPC_ERROR_CODE_NOT_ENOUGH_MONEY');
    });

    it('should return non-string values unchanged', () => {
        const obj = { message: 'error' };
        expect(pipe.transform(obj)).toBe(obj);
    });
});
