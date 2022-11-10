import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-custom-token',
  templateUrl: './add-custom-token.component.html',
  styleUrls: ['./add-custom-token.component.scss']
})
export class AddCustomTokenComponent {
  @HostBinding('class.modal-overlay') modalOverlay = true;

  @Output() eventClose: EventEmitter<void> = new EventEmitter<void>();

  @Output() eventSubmit: EventEmitter<string> = new EventEmitter<string>();

  formGroup = new FormGroup({
    assetID: new FormControl(null, Validators.compose([Validators.required])),
  });

  beforeSubmit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAsTouched();
      this.formGroup.updateValueAndValidity();
      return;
    }

    this.submit();
  }

  submit(): void {
    const { assetID } = this.formGroup.value;
    this.eventSubmit.emit(assetID);
  }
}
