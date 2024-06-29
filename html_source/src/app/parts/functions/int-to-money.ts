import { BigNumber } from 'bignumber.js';

export const intToMoney = (value: number | string | BigNumber, decimal_point?: any): string => {
    if (value === 0 || value === undefined) {
        return '0';
    }
    let maxFraction = 12;
    if (decimal_point) {
        maxFraction = parseInt(decimal_point, 10);
    }
    const power = Math.pow(10, maxFraction);
    let str = new BigNumber(value).div(power).toFixed(maxFraction);

    for (let i = str.length - 1; i >= 0; i--) {
        if (str[i] !== '0') {
            str = str.substr(0, i + 1);
            break;
        }
    }
    if (str[str.length - 1] === '.') {
        str = str.substr(0, str.length - 1);
    }
    return str;
};
