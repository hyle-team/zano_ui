import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { VariablesService } from '@parts/services/variables.service';
import { ZanoValidators } from '@parts/utils/zano-validators';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-add-custom-token',
  templateUrl: './add-custom-token.component.html',
  styleUrls: ['./add-custom-token.component.scss'],
})
export class AddCustomTokenComponent {
  formGroup = new UntypedFormGroup({
    assetID: new UntypedFormControl(
      null,
      Validators.compose([Validators.required, ZanoValidators.hash])
    ),
  });

  constructor(
    public variablesService: VariablesService,
    private dialogRef: DialogRef
  ) {}

  beforeSubmit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAsTouched();
      this.formGroup.updateValueAndValidity();
      return;
    }

    this.submit();
  }

  submit(): void {
    return;
  }

  close(): void {
    this.dialogRef.close();
  }
}
