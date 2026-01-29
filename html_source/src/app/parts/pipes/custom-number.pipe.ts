import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';

const ROUND_DOWN = BigNumber.ROUND_DOWN;

interface NumberFormatOptions {
    maxDecimals?: number;
    padZeros?: boolean;
    groupSeparator?: string;
    decimalSeparator?: string;
}

@Pipe({
    name: 'customNumber',
    standalone: true,
})
export class CustomNumberFormatPipe implements PipeTransform {
    constructor() {
        BigNumber.set({ DECIMAL_PLACES: 20 });
    }

    transform(value: number | string | null | undefined, options?: NumberFormatOptions): string {
        const settings: Required<NumberFormatOptions> = {
            maxDecimals: options?.maxDecimals ?? 20,
            padZeros: options?.padZeros ?? false,
            groupSeparator: options?.groupSeparator ?? ' ',
            decimalSeparator: options?.decimalSeparator ?? '.',
        };

        const maxDigits = Math.max(0, Math.min(20, settings.maxDecimals));

        if (value === null || value === undefined || value === '') {
            return '';
        }

        let bigNum: BigNumber;

        try {
            bigNum = new BigNumber(value);
        } catch (e) {
            return String(value);
        }

        if (bigNum.isNaN()) {
            return String(value);
        }

        let rawValueString: string;
        const rawDecimalSeparator = '.';

        if (settings.padZeros) {
            rawValueString = bigNum.toFixed(maxDigits, ROUND_DOWN);
        } else {
            const rawString = bigNum.toString();
            const parts = rawString.split(rawDecimalSeparator);

            const integerPart = parts[0];
            let fractionPart = parts.length > 1 ? parts[1] : '';

            if (fractionPart.length > maxDigits) {
                fractionPart = fractionPart.substring(0, maxDigits);
            }
            rawValueString = parts.length > 1 ? `${integerPart}.${fractionPart}` : integerPart;
        }

        const parts = rawValueString.split(rawDecimalSeparator);

        const integerPart = parts[0];
        const fractionPart = parts.length > 1 ? parts[1] : '';

        let formattedIntegerPart = '';

        for (let i = integerPart.length - 1, count = 0; i >= 0; i--, count++) {
            formattedIntegerPart = integerPart[i] + formattedIntegerPart;
            if (count % 3 === 2 && i !== 0 && !(i === 1 && integerPart[0] === '-')) {
                formattedIntegerPart = settings.groupSeparator + formattedIntegerPart;
            }
        }
        if (formattedIntegerPart.startsWith(settings.groupSeparator) && formattedIntegerPart.length > 1) {
            formattedIntegerPart = formattedIntegerPart.substring(settings.groupSeparator.length);
        }

        if (!fractionPart) {
            return formattedIntegerPart;
        }

        return `${formattedIntegerPart}${settings.decimalSeparator}${fractionPart}`;
    }
}
