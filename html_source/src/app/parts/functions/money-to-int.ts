import { BigNumber } from 'bignumber.js';

export const moneyToInt = (value, decimal_point?: any): BigNumber => {
    const CURRENCY_DISPLAY_DECIMAL_POINT = decimal_point ?? 12;
    let result: BigNumber = new BigNumber('');
    if (value) {
        let am_str = new BigNumber(value).toString().trim();
        const point_index = am_str.indexOf('.');
        let fraction_size = 0;
        if (-1 !== point_index) {
            fraction_size = am_str.length - point_index - 1;
        // && '0' === am_str[am_str.length - 1]
            while (CURRENCY_DISPLAY_DECIMAL_POINT < fraction_size) {
                am_str = am_str.slice(0, am_str.length - 1);
                --fraction_size;
            }
            if (CURRENCY_DISPLAY_DECIMAL_POINT < fraction_size) {
                am_str = am_str.slice(0, point_index) + am_str.slice(point_index + 1, CURRENCY_DISPLAY_DECIMAL_POINT);
            } else {
                am_str = am_str.slice(0, point_index) + am_str.slice(point_index + 1, am_str.length);
            }
        } else {
            fraction_size = 0;
        }
        if (!am_str.length) {
            return undefined;
        }
        if (am_str.length >= 21) {
            am_str = am_str.slice(0, am_str.indexOf('.') !== -1 ? (decimal_point === 20 ? 22 : 21) : 20);
        }
        if (am_str[am_str.length - 1] === '.') {
            am_str = am_str.substr(0, am_str.length - 1);
        }
        if (fraction_size < CURRENCY_DISPLAY_DECIMAL_POINT) {
            for (let i = 0; i !== CURRENCY_DISPLAY_DECIMAL_POINT - fraction_size; i++) {
                am_str = am_str + '0';
            }
        }
        result = new BigNumber(am_str).integerValue();
    }
    return result;
};
