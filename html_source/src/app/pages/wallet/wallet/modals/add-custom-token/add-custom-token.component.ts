import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VariablesService } from '@parts/services/variables.service';
import { ZanoValidators } from '@parts/utils/zano-validators';
import { DialogRef } from '@angular/cdk/dialog';
import { BackendService } from '@api/services/backend.service';
import { Asset, ParamsAddCustomAssetId } from '@api/models/assets.model';

@Component({
  selector: 'app-add-custom-token',
  templateUrl: './add-custom-token.component.html',
  styleUrls: ['./add-custom-token.component.scss'],
})
export class AddCustomTokenComponent {
  formGroup = new FormGroup({
    asset_id: new FormControl<string>(
      null,
      Validators.compose([Validators.required, ZanoValidators.hash])
    ),
  });

  constructor(
    public variablesService: VariablesService,
    public backendService: BackendService,
    private dialogRef: DialogRef<Asset | undefined>
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
    const { asset_id } = this.formGroup.value;
    const { wallet_id } = this.variablesService.currentWallet;
    const params: ParamsAddCustomAssetId = {
      asset_id,
      wallet_id,
    };
    this.backendService.addCustomAssetId(
      params,
      (status, { asset_descriptor }) => {
        if (status) {
          const asset: Asset = {
            asset_info: {
              ...asset_descriptor,
              asset_id,
            },
            awaiting_in: 0,
            awaiting_out: 0,
            total: 0,
            unlocked: 0,
          };
          this.dialogRef.close(asset);
        } else {
          console.warn('Opss! Asset not added');
        }
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
