import { Component, inject } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AssetInfo } from '@api/models/assets.model';
import { EmitParams, ResponseUpdateAsset, UpdateAssetParams } from '@api/models/custom-asstest.model';
import { BackendService } from '@api/services/backend.service';

@Component({
    selector: 'app-emit-custom-asset',
    templateUrl: './emit-custom-asset.component.html',
    styleUrls: ['./emit-custom-asset.component.scss'],
})
export class EmitCustomAssetComponent {
    public readonly variablesService = inject(VariablesService);

    private readonly backendService = inject(BackendService);

    public readonly data: { assetInfo: AssetInfo } = inject(DIALOG_DATA);

    public readonly dialogRef = inject(DialogRef);

    private readonly fb = inject(NonNullableFormBuilder);

    public readonly form = this.fb.group({
        amount: this.fb.control('', [Validators.required]),
    });

    public submit(): void {
        const { wallet_id } = this.variablesService.currentWallet;
        const { asset_id } = this.data.assetInfo;
        const { amount } = this.form.getRawValue();
        const params: EmitParams = {
            asset_id,
            destinations: []
        };
        this.backendService.call_wallet_rpc(
            [
                wallet_id,
                {
                    jsonrpc: '2.0',
                    id: 0,
                    method: 'emit_asset',
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
