import { Component, inject, NgZone } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { AssetInfo } from '@api/models/assets.model';
import { BackendService } from '@api/services/backend.service';
import { UpdateAssetParams } from '@api/models/custom-asstest.model';
import { REG_EXP_HEX } from '@parts/utils/zano-validators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-update-custom-asset',
    templateUrl: './update-custom-asset.component.html',
    styleUrls: ['./update-custom-asset.component.scss'],
})
export class UpdateCustomAssetComponent {
    public readonly variablesService: VariablesService = inject(VariablesService);
    public readonly data: { asset_info: AssetInfo } = inject(MAT_DIALOG_DATA);
    public readonly matDialogRef: MatDialogRef<UpdateCustomAssetComponent> = inject(MatDialogRef);
    private readonly _backendService: BackendService = inject(BackendService);
    private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
    private _ngZone: NgZone = inject(NgZone);
    public readonly form = this.fb.group({
        owner: this.fb.control('', [
            Validators.required,
            (control): ValidationErrors | null => {
                if (control.value.length === 64) {
                    if (!REG_EXP_HEX.test(control.value)) {
                        return { hex_not_valid: true };
                    } else {
                        return null;
                    }
                }

                if (control.value) {
                    this._backendService.validateAddress(control.value, (status) => {
                        this._ngZone.run(() => {
                            if (status === false) {
                                control.setErrors(Object.assign({ address_not_valid: true }, control.errors));
                            } else {
                                if (control.hasError('address_not_valid')) {
                                    delete control.errors['address_not_valid'];
                                    if (Object.keys(control.errors).length === 0) {
                                        control.setErrors(null);
                                    }
                                }
                            }
                        });
                    });
                    return control.hasError('address_not_valid') ? { address_not_valid: true } : null;
                }

                return null;
            },
        ]),
    });

    public submit(): void {
        const { wallet_id } = this.variablesService.current_wallet;
        const { asset_id } = this.data.asset_info;
        const { owner } = this.form.getRawValue();
        const params: UpdateAssetParams = {
            asset_id,
            asset_descriptor: {
                owner,
            },
        };

        this._backendService.asyncCall2a(
            'call_wallet_rpc',
            wallet_id,
            {
                jsonrpc: '2.0',
                id: 0,
                method: 'update_asset',
                params,
            },
            (job_id: number) => {
                this._ngZone.run(() => {
                    this.matDialogRef.close(job_id);
                });
            }
        );
    }
}
