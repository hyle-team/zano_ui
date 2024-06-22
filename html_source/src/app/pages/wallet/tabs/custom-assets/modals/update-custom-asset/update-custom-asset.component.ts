import { Component, inject } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AssetInfo } from '@api/models/assets.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { BackendService } from '@api/services/backend.service';
import { ResponseUpdateAsset, UpdateAssetParams } from '@api/models/custom-asstest.model';

@Component({
    selector: 'app-update-custom-asset',
    templateUrl: './update-custom-asset.component.html',
    styleUrls: ['./update-custom-asset.component.scss'],
})
export class UpdateCustomAssetComponent {
    public readonly variablesService = inject(VariablesService);
    public readonly data: { assetInfo: AssetInfo } = inject(DIALOG_DATA);
    public readonly dialogRef = inject(DialogRef);
    private readonly backendService = inject(BackendService);
    private readonly fb = inject(NonNullableFormBuilder);
    public readonly form = this.fb.group({
        owner: this.fb.control('', [
            Validators.required,
            Validators.minLength(64),
            Validators.maxLength(64),
            Validators.pattern('^[a-fA-F0-9]{64}$')
        ]),
    });

    public submit(): void {
        const { wallet_id } = this.variablesService.currentWallet;
        const { asset_id } = this.data.assetInfo;
        const { owner } = this.form.getRawValue();
        const params: UpdateAssetParams = {
            asset_id,
            asset_descriptor: {
                owner,
            },
        };
        this.backendService.call_wallet_rpc(
            [
                wallet_id,
                {
                    jsonrpc: '2.0',
                    id: 0,
                    method: 'update_asset',
                    params,
                },
            ],
            (status: boolean, response_data: ResponseUpdateAsset) => {
                if (!status) {
                    return;
                }
                console.log(response_data);
                // TODO: Something call dialog with details transaction
                this.dialogRef.close(true);
            }
        );
    }
}
