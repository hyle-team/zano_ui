import { moneyToInt } from '@parts/functions/money-to-int';

describe('money-to-int', () => {
    it('Decimal point 20', () => {
        expect(moneyToInt('0.1844674407370955161', 20).toString()).toBe('18446744073709551610');
    });

    it('Decimal point 19', () => {
        expect(moneyToInt('1.8446744073709551615', 19).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 18', () => {
        expect(moneyToInt('18.446744073709551615', 18).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 17', () => {
        expect(moneyToInt('184.46744073709551615', 17).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 16', () => {
        expect(moneyToInt('1844.6744073709551615', 16).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 15', () => {
        expect(moneyToInt('18446.744073709551615', 15).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 14', () => {
        expect(moneyToInt('184467.44073709551615', 14).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 13', () => {
        expect(moneyToInt('1844674.4073709551615', 13).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 12', () => {
        expect(moneyToInt('18446744.073709551615', 12).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 11', () => {
        expect(moneyToInt('184467440.73709551615', 11).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 10', () => {
        expect(moneyToInt('1844674407.3709551615', 10).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 9', () => {
        expect(moneyToInt('18446744073.709551615', 9).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 8', () => {
        expect(moneyToInt('184467440737.09551615', 8).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 7', () => {
        expect(moneyToInt('1844674407370.9551615', 7).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 6', () => {
        expect(moneyToInt('18446744073709.551615', 6).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 5', () => {
        expect(moneyToInt('184467440737095.51615', 5).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 4', () => {
        expect(moneyToInt('1844674407370955.1615', 4).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 3', () => {
        expect(moneyToInt('18446744073709551.615', 3).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 2', () => {
        expect(moneyToInt('184467440737095516.15', 2).toString()).toBe('18446744073709551615');
    });

    it('Decimal point 1', () => {
        console.log();
        console.log(moneyToInt('18446744073709551699', 1).toString());
        expect(moneyToInt('1844674407370955161.5', 1).toString()).toBe('18446744073709551615');
        expect(moneyToInt('1844674407370955160.9', 1).toString()).toBe('18446744073709551609');
        expect(moneyToInt('184467440737095516991.52', 1).toString()).toBe('18446744073709551699');
        expect(moneyToInt('0.1', 1).toString()).toBe('1');
    });

    it('Decimal point 0', () => {
        expect(moneyToInt('18446744073709551615', 0).toString()).toBe('18446744073709551615');
        expect(moneyToInt('18446744073709551615.0', 0).toString()).toBe('18446744073709551615');
        expect(moneyToInt('18446744073709551615.9', 0).toString()).toBe('18446744073709551615');
        expect(moneyToInt('18446744073709551613.9', 0).toString()).toBe('18446744073709551613');
        expect(moneyToInt('18446744073709551614.1', 0).toString()).toBe('18446744073709551614');
        expect(moneyToInt('1.1', 0).toString()).toBe('1');
        expect(moneyToInt('0.1', 0).toString()).toBe('0');
        expect(moneyToInt('184467440737095516161', 0).toString()).toBe('18446744073709551616');
        expect(moneyToInt('15245.2548', 0).toString()).toBe('15245');
    });
});
