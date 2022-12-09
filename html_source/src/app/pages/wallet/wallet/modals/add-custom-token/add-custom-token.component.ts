import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VariablesService } from '@parts/services/variables.service';
import { ZanoValidators } from '@parts/utils/zano-validators';
import { DialogRef } from '@angular/cdk/dialog';
import { BackendService } from '@api/services/backend.service';
import { Asset, ParamsAddCustomAssetId } from '@api/models/assets.model';
import { WalletsService } from '@parts/services/wallets.service';

@Component({
  selector: 'app-add-custom-token',
  template: `
    <form
      (ngSubmit)="beforeSubmit()"
      [formGroup]="formGroup"
      class="modal p-2 border-radius-0_8-rem bg-light-blue max-w-54-rem w-100 max-h-100"
    >
      <div class="content" fxLayout="column">
        <h3 class="mb-2">
          {{ 'WALLET.MODAL_ADD_CUSTOM_TOKEN.TITLE' | translate }}
        </h3>

        <div class="form__field">
          <label for="asset_id">{{
            'WALLET.MODAL_ADD_CUSTOM_TOKEN.FIELD_TITLE' | translate
          }}</label>
          <input
            (contextmenu)="variablesService.onContextMenuPasteSelect($event)"
            class="form__field--input"
            formControlName="asset_id"
            id="asset_id"
            name="asset_id"
            placeholder="Enter Asset ID"
            type="text"
          />
          <div
            *ngIf="
              formGroup.get('asset_id').touched &&
              formGroup.get('asset_id').hasError('invalidHash')
            "
            class="error"
          >
            Invalid hash
          </div>
        </div>
      </div>

      <div class="controls" fxLayout="row nowrap" fxLayoutGap="1rem">
        <button (click)="close()" class="outline big w-100" type="button">
          {{ 'MODALS.CANCEL' | translate }}
        </button>
        <button
          [disabled]="formGroup.invalid"
          class="primary big w-100"
          type="submit"
        >
          {{ 'MODALS.ADD_TOKEN' | translate }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      :host {
        max-width: 54rem;
        width: 100vw;
        display: block;
      }
    `,
  ],
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
    private walletsService: WalletsService,
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
          this.walletsService.updateWalletInfo(wallet_id);
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
