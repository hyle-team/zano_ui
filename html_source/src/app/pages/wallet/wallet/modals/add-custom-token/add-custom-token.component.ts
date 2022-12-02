import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { VariablesService } from '@parts/services/variables.service';
import { ZanoValidators } from '@parts/utils/zano-validators';

@Component({
  selector: 'app-add-custom-token',
  templateUrl: './add-custom-token.component.html',
  styleUrls: ['./add-custom-token.component.scss'],
})
export class AddCustomTokenComponent {
  @HostBinding('class.modal-overlay') modalOverlay = true;

  @Output() eventClose: EventEmitter<void> = new EventEmitter<void>();

  @Output() eventSubmit: EventEmitter<string> = new EventEmitter<string>();

  formGroup = new UntypedFormGroup({
    assetID: new UntypedFormControl(
      null,
      Validators.compose([Validators.required, ZanoValidators.hash])
    ),
  });

  constructor(public variablesService: VariablesService) {}

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
