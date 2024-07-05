import { Component, inject, NgZone } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AssetInfo } from '@api/models/assets.model';
import { EmitParams } from '@api/models/custom-asstest.model';
import { BackendService } from '@api/services/backend.service';
import { intToMoney } from '@parts/functions/int-to-money';
import BigNumber from 'bignumber.js';
import { moneyToInt } from '@parts/functions/money-to-int';

@Component({
    selector: 'app-emit-custom-asset',
    templateUrl: './emit-custom-asset.component.html',
    styleUrls: ['./emit-custom-asset.component.scss'],
})
export class EmitCustomAssetComponent {
    public readonly variablesService = inject(VariablesService);
    public readonly data: { assetInfo: AssetInfo } = inject(DIALOG_DATA);
    public readonly dialogRef = inject(DialogRef);
    private readonly _backendService = inject(BackendService);
    private readonly _fb = inject(NonNullableFormBuilder);
    private _ngZone: NgZone = inject(NgZone);

    public readonly form = this._fb.group({
        amount: this._fb.control('', [
            Validators.required,
            (control): ValidationErrors | null => {
                const {
                    assetInfo: { total_max_supply, current_supply, decimal_point },
                } = this.data;
                const { value: amount } = control;

                const prepared_total_max_supply: BigNumber = new BigNumber(intToMoney(total_max_supply, decimal_point));
                const prepared_current_supply: BigNumber = new BigNumber(intToMoney(current_supply, decimal_point));
                if (prepared_current_supply.plus(amount).isGreaterThan(prepared_total_max_supply)) {
                    return { greater_than_total_max_supply: { max: prepared_total_max_supply.toString() } };
                }
                return null;
            },
        ]),
    });

    public submit(): void {
        const {
            currentWallet: { wallet_id, address },
        } = this.variablesService;
        const {
            assetInfo: { asset_id, decimal_point },
        } = this.data;
        const { amount } = this.form.getRawValue();
        const params: EmitParams = {
            asset_id,
            destinations: [
                {
                    address,
                    amount: moneyToInt(amount, decimal_point).toString(),
                },
            ],
        };

        this._backendService.asyncCall2a(
            'call_wallet_rpc',
            wallet_id,
            {
                jsonrpc: '2.0',
                id: 0,
                method: 'emit_asset',
                params,
            },
            async (job_id: number): Promise<void> => {
                this._ngZone.run(() => {
                this.dialogRef.close(job_id);
                });
            }
        );
    }
}
