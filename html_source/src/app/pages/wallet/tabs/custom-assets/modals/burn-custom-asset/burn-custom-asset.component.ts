import { Component, inject } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { AssetBalance, AssetInfo } from '@api/models/assets.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import BigNumber from 'bignumber.js';
import { intToMoney } from '@parts/functions/int-to-money';
import { insuficcientFunds } from '@parts/utils/zano-errors';
import { BackendService } from '@api/services/backend.service';

@Component({
  selector: 'app-burn-custom-asset',
  templateUrl: './burn-custom-asset.component.html',
  styleUrls: ['./burn-custom-asset.component.scss']
})
export class BurnCustomAssetComponent {
    public readonly variablesService = inject(VariablesService);

    private readonly fb = inject(NonNullableFormBuilder);

    private readonly _backendService = inject(BackendService);

    public readonly data: { assetInfo: AssetInfo } = inject(DIALOG_DATA);

    public readonly form = this.fb.group(
        {
            amount: this.fb.control('', [
                Validators.required,
                (control): ValidationErrors | null => {
                    const { value: amount } = control;
                    const { assetInfo: { asset_id } } = this.data;
                    const { currentWallet, maximum_value } = this.variablesService;
                    const prepared_amount = new BigNumber(amount);
                    const assetBalance: AssetBalance | undefined = currentWallet.getBalanceByAssetId(asset_id);

                    if (!assetBalance) {
                        return {
                            asset_not_found: true,
                        };
                    }

                    const {
                        unlocked,
                        asset_info: { decimal_point },
                    } = assetBalance;

                    const maximum_amount_by_decimal_point = intToMoney(maximum_value, decimal_point);
                    if (prepared_amount.isGreaterThan(maximum_amount_by_decimal_point)) {
                        return { greater_than_maximum_amount: { max: maximum_amount_by_decimal_point } };
                    }

                    const preparedUnlocked = intToMoney(unlocked, decimal_point);
                    return prepared_amount.isGreaterThan(preparedUnlocked) ? { insuficcientFunds } : null;
                }
            ]),
        }
    );

    public readonly dialogRef = inject(DialogRef);

    public submit(): void {
        // TODO: Update after creation api for burn
        // const {
        //     currentWallet: { wallet_id },
        // } = this.variablesService;
        // const params = {};
        //
        // this._backendService.asyncCall2a(
        //     'call_wallet_rpc',
        //     wallet_id,
        //     {
        //         jsonrpc: '2.0',
        //         id: 0,
        //         method: 'burn_asset',
        //         params,
        //     },
        //     async (status, job_id: number): Promise<void> => {
        //         this.dialogRef.close(job_id);
        //     }
        // );
    }
}
