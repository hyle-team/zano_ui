import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const regExpHash = /^[a-f0-9]{64}$/i;
export const regExpAliasName = /^@?[a-z\d.-]{6,25}$/;
export const regExpPassword = /^[a-zA-Z0-9_.\]*|~!?@#$%^&+{}()<>:;"'-=,/[\\]*$/;

export class ZanoValidators {
  static hash({ value }: AbstractControl): ValidationErrors | null {
    return regExpHash.test(value) ? null : { invalidHash: true };
  }

  static formMatch(
    firstControlName: string,
    secondControlName: string,
    nameErrorKey = 'mismatch'
  ): ValidatorFn {
    return (abstractControl: AbstractControl): ValidationErrors | null =>
      abstractControl.get(firstControlName).value ===
      abstractControl.get(secondControlName).value
        ? null
        : { [nameErrorKey]: true };
  }

  static duplicate(valuesForComparisons: string | string[]): ValidatorFn {
    return ({ value }: AbstractControl): ValidationErrors | null => {
      const errorObject = { duplicate: true };
      let error = null;

      if (typeof value === 'string' && value === valuesForComparisons) {
        error = errorObject;
      }

      if (
        Array.isArray(valuesForComparisons) &&
        valuesForComparisons.includes(value)
      ) {
        error = errorObject;
      }

      return error;
    };
  }
}
