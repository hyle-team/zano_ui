import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { notFileZanoWallet, ZanoValidationErrors } from '@parts/utils/zano-errors';
import { MIMETypes } from '@parts/utils/MIME-types';
import { BigNumber } from 'bignumber.js';
import { intToMoney } from '@parts/functions/int-to-money';

export const REG_EXP_HEX = /^[a-f0-9]{64}$/i;
export const REG_EXP_ALIAS_NAME = /^@?[a-z\d.-]{2,25}$/;
export const REG_EXP_REGISTER_ALIAS_NAME = /^@?[a-z\d.-]{6,25}$/;
export const REG_EXP_PASSWORD = /^[A-Za-z0-9!@#$%^&*()_+\-={}\[\]|:;"'<>,.?/~`]{1,40}$/;

export class ZanoValidators {
    static hash({ value }: AbstractControl): ValidationErrors | null {
        return REG_EXP_HEX.test(value) ? null : { invalidHash: true };
    }

    static formMatch(firstControlName: string, secondControlName: string, nameErrorKey = 'mismatch'): ValidatorFn {
        return (abstractControl: AbstractControl): ValidationErrors | null =>
            abstractControl.get(firstControlName).value === abstractControl.get(secondControlName).value ? null : { [nameErrorKey]: true };
    }

    static duplicate(valuesForComparisons: string | string[]): ValidatorFn {
        return ({ value }: AbstractControl): ValidationErrors | null => {
            const errorObject = { duplicate: true };
            let error = null;

            if (typeof value === 'string' && value === valuesForComparisons) {
                error = errorObject;
            }

            if (Array.isArray(valuesForComparisons) && valuesForComparisons.includes(value)) {
                error = errorObject;
            }

            return error;
        };
    }

    static zeroValue(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        const isZero = new BigNumber(value).eq(0);

        return isZero ? { zero: true } : null;
    }

    static greaterMax(maxValue: string | number | BigNumber, decimalPoint: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            const max = new BigNumber(intToMoney(maxValue, decimalPoint));
            const amount = new BigNumber(control.value);

            return amount.isGreaterThan(max) ? { greater_max: { max: max.toString() } } : null;
        };
    }

    static lessMin(minValue: string | BigNumber): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = new BigNumber(control.value);
            const min = new BigNumber(minValue);

            return value.isLessThan(min) ? { less_min: true } : null;
        };
    }
}

export const filePathWalletValidator = (path: string): ZanoValidationErrors | null => {
    if (!(path && path.trim().length)) {
        return null;
    }

    const positionLastSlash = path.lastIndexOf('/');
    const fileName = path.slice(positionLastSlash + 1);

    if (!(fileName && fileName.trim().length)) {
        return null;
    }

    if (fileName) {
        let index = 0;
        while (index < MIMETypes.length) {
            if (fileName.includes(MIMETypes[index])) {
                return notFileZanoWallet;
            }
            index++;
        }
    }

    return null;
};
