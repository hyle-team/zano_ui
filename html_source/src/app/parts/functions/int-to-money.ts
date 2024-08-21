import { BigNumber } from 'bignumber.js';

export const intToMoney = (value: number | string | BigNumber, decimal_point?: any): string => {
    if (value === 0 || value === undefined) {
        return '0';
    }
    let maxFraction = 12;
    if (decimal_point !== undefined && decimal_point !== null) {
        maxFraction = parseInt(decimal_point, 10);
    }
    const power = Math.pow(10, maxFraction);
    let str = new BigNumber(value).div(power).toFixed(maxFraction, 1);

    if (maxFraction != 0) {
        for (let i = str.length - 1; i >= 0; i--) {
            if (str[i] !== '0') {
                str = str.substr(0, i + 1);
                break;
            }
        }
    }

    if (str.length >= 21) {
        const hasMinus = str.indexOf('-') !== -1;
        const hasDot = str.indexOf('.') !== -1;
        const sliceFrom = 0;
        let sliceTo = 20;

        if (hasDot) {
            sliceTo += 1;

            if (decimal_point == 20) {
                sliceTo += 1;
            }
        }

        if (hasMinus) {
            sliceTo += 1;
        }

        str = str.slice(sliceFrom, sliceTo);
    }
    if (str[str.length - 1] === '.') {
        str = str.substr(0, str.length - 1);
    }
    return str;
};
