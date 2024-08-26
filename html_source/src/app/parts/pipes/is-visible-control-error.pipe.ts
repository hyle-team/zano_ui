import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'isVisibleControlError',
  standalone: true
})
export class IsVisibleControlErrorPipe implements PipeTransform {

  transform(control: AbstractControl | null): boolean {
      if (!control) {
          return false;
      }
      return control.invalid && (control.dirty || control.touched);
  }
}
