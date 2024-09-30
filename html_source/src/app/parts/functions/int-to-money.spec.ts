import { intToMoney } from '@parts/functions/int-to-money';
import BigNumber from 'bignumber.js';

describe('int-to-money', () => {
    it('Decimal point 20', () => {
        expect(intToMoney('18446744073709551615', 20)).toBe('0.18446744073709551615');
        expect(intToMoney('18446744073709551610', 20)).toBe('0.1844674407370955161');
        expect(intToMoney('1', 20)).toBe('0.00000000000000000001');
        expect(intToMoney(new BigNumber('1').negated().toString(), 20)).toBe('-0.00000000000000000001');
    });

    it('Decimal point 19', () => {
        expect(intToMoney('18446744073709551615', 19)).toBe('1.8446744073709551615');
    });

    it('Decimal point 18', () => {
        expect(intToMoney('18446744073709551615', 18)).toBe('18.446744073709551615');
    });

    it('Decimal point 17', () => {
        expect(intToMoney('18446744073709551615', 17)).toBe('184.46744073709551615');
    });

    it('Decimal point 16', () => {
        expect(intToMoney('18446744073709551615', 16)).toBe('1844.6744073709551615');
    });

    it('Decimal point 15', () => {
        expect(intToMoney('18446744073709551615', 15)).toBe('18446.744073709551615');
    });

    it('Decimal point 14', () => {
        expect(intToMoney('18446744073709551615', 14)).toBe('184467.44073709551615');
    });

    it('Decimal point 13', () => {
        expect(intToMoney('18446744073709551615', 13)).toBe('1844674.4073709551615');
    });

    it('Decimal point 12', () => {
        expect(intToMoney('18446744073709551615', 12)).toBe('18446744.073709551615');
        expect(intToMoney('1000000000', 12).toString()).toBe('0.001');
        expect(intToMoney('1', 12).toString()).toBe('0.000000000001');
    });

    it('Decimal point 11', () => {
        expect(intToMoney('18446744073709551615', 11)).toBe('184467440.73709551615');
    });

    it('Decimal point 10', () => {
        expect(intToMoney('18446744073709551615', 10)).toBe('1844674407.3709551615');
    });

    it('Decimal point 9', () => {
        expect(intToMoney('18446744073709551615', 9)).toBe('18446744073.709551615');
    });

    it('Decimal point 8', () => {
        expect(intToMoney('18446744073709551615', 8)).toBe('184467440737.09551615');
    });

    it('Decimal point 7', () => {
        expect(intToMoney('18446744073709551615', 7)).toBe('1844674407370.9551615');
    });

    it('Decimal point 6', () => {
        expect(intToMoney('18446744073709551615', 6)).toBe('18446744073709.551615');
    });

    it('Decimal point 5', () => {
        expect(intToMoney('18446744073709551615', 5)).toBe('184467440737095.51615');
    });

    it('Decimal point 4', () => {
        expect(intToMoney('18446744073709551615', 4)).toBe('1844674407370955.1615');
    });

    it('Decimal point 3', () => {
        expect(intToMoney('18446744073709551615', 3)).toBe('18446744073709551.615');
        expect(intToMoney('3', 3)).toBe('0.003');
    });

    it('Decimal point 2', () => {
        expect(intToMoney('18446744073709551615', 2)).toBe('184467440737095516.15');
    });

    it('Decimal point 1', () => {
        expect(intToMoney('18446744073709551615', 1)).toBe('1844674407370955161.5');
        expect(intToMoney('18446744073709551609', 1)).toBe('1844674407370955160.9');
        expect(intToMoney('184467440737095516991', 1)).toBe('18446744073709551699');
        expect(intToMoney('1', 1)).toBe('0.1');
    });

    it('Decimal point 0', () => {
        expect(intToMoney('18446744073709551615', 0)).toBe('18446744073709551615');
        expect(intToMoney('18446744073709551615.0', 0)).toBe('18446744073709551615');
        expect(intToMoney('18446744073709551615.9', 0)).toBe('18446744073709551615');
        expect(intToMoney('18446744073709551613.9', 0)).toBe('18446744073709551613');
        expect(intToMoney('18446744073709551614.1', 0)).toBe('18446744073709551614');
        expect(intToMoney('1.1', 0)).toBe('1');
        expect(intToMoney('0.1', 0)).toBe('0');
        expect(intToMoney('184467440737095516161', 0)).toBe('18446744073709551616');
        expect(intToMoney('15245.2548', 0)).toBe('15245');
        expect(intToMoney('1800000', 0)).toBe('1800000');
    });
});
