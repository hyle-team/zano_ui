import { calculatePosEstimateSec } from '@parts/functions/calculate-pos-estimate-sec';

describe('calculate-pos-estimate-sec', () => {
    it('returns 0 when estimator is non-positive', () => {
        expect(calculatePosEstimateSec(10, 0)).toBe(0);
        expect(calculatePosEstimateSec(10, -1)).toBe(0);
    });

    it('calculates estimate seconds for normal case', () => {
        expect(calculatePosEstimateSec(40, 100)).toBe(120);
    });

    it('returns 0 when current attempts exceed estimator', () => {
        expect(calculatePosEstimateSec(150, 100)).toBe(0);
    });

    it('returns 0 for invalid numeric values', () => {
        expect(calculatePosEstimateSec(Number.NaN, 100)).toBe(0);
        expect(calculatePosEstimateSec(100, Number.NaN)).toBe(0);
    });
});
