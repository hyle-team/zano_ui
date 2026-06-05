import { calculatePosProgress } from '@parts/functions/calculate-pos-progress';

describe('calculate-pos-progress', () => {
    it('returns 0 when estimator is non-positive', () => {
        expect(calculatePosProgress(10, 0)).toBe(0);
        expect(calculatePosProgress(10, -1)).toBe(0);
    });

    it('calculates progress in percent', () => {
        expect(calculatePosProgress(25, 100)).toBe(25);
        expect(calculatePosProgress(40, 80)).toBe(50);
    });

    it('clamps to 100 when current attempts exceed estimator', () => {
        expect(calculatePosProgress(150, 100)).toBe(100);
    });

    it('returns 0 for invalid numeric values', () => {
        expect(calculatePosProgress(Number.NaN, 100)).toBe(0);
        expect(calculatePosProgress(100, Number.NaN)).toBe(0);
    });
});
