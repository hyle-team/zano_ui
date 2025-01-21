import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { notFileZanoWallet, ZanoValidationErrors } from '@parts/utils/zano-errors';
import { MIMETypes } from '@parts/utils/MIME-types';

export const regExpHex = /^[a-f0-9]{64}$/i;
export const regExpAliasName = /^@?[a-z\d.-]{2,25}$/;
export const regExpRegisterAliasName = /^@?[a-z\d.-]{6,25}$/;
export const regExpPassword = /^[A-Za-z0-9!@#$%^&*()_+\-={}\[\]|:;"'<>,.?/~`]{1,40}$/;

export class ZanoValidators {
    static hash({ value }: AbstractControl): ValidationErrors | null {
        return regExpHex.test(value) ? null : { invalidHash: true };
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
