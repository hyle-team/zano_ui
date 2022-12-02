import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ZanoValidators {
  static hash({ value }: AbstractControl): ValidationErrors | null {
    const regExp = /^[a-f0-9]{64}$/i;
    return regExp.test(value) ? null : { invalidHash: true };
  }
}
