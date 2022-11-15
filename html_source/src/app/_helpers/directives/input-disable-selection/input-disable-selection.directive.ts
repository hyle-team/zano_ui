import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'input'
})
export class InputDisableSelectionDirective {
  @HostListener('mousedown', ['$event'])
  handleInput(event: Event) {
    if ((<HTMLInputElement>event.target).readOnly) {
      event.preventDefault();
    }
  }
}
