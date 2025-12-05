import { Component, inject, NgZone } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VariablesService } from '@parts/services/variables.service';
import { ZanoValidators } from '@parts/utils/zano-validators';
import { BackendService } from '@api/services/backend.service';
import { AssetBalance, AssetInfo, ParamsAddCustomAssetId, ResponseAddCustomAssetId } from '@api/models/assets.model';
import { WalletsService } from '@parts/services/wallets.service';
import { wrongAssetId } from '@parts/utils/zano-errors';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent } from '@parts/components/loader.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AutoFocusDirective } from '@parts/directives/autofocus.directive';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';

@Component({
    selector: 'app-add-custom-token',
    standalone: true,
    templateUrl: './add-custom-token.component.html',
    styleUrls: ['./add-custom-token.component.scss'],
    imports: [
        CommonModule,
        FlexModule,
        TranslateModule,
        ReactiveFormsModule,
        LoaderComponent,
        MatDialogModule,
        AutoFocusDirective,
        IsVisibleControlErrorPipe,
    ],
})
export class AddCustomTokenComponent {
    loading = false;

    private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    variablesService: VariablesService = inject(VariablesService);

    formGroup = this._fb.group<{ asset_id: FormControl<string> }>({
        asset_id: this._fb.control('', [
            (control) => {
                const asset_id = control.value;
                const {
                    current_wallet: { balances },
                } = this.variablesService;

                if (balances.find((balance) => balance.asset_info.asset_id === asset_id)) {
                    return { assetIdExists: true };
                }

                return null;
            },
            Validators.required,
            ZanoValidators.hash,
            Validators.maxLength(64),
        ]),
    });

    private _backendService: BackendService = inject(BackendService);

    private _walletsService: WalletsService = inject(WalletsService);

    private _ngZone: NgZone = inject(NgZone);

    private _matDialogRef: MatDialogRef<AssetBalance | undefined> = inject(MatDialogRef);

    beforeSubmit() {
        if (this.formGroup.invalid) {
            this.formGroup.markAsTouched();
            this.formGroup.updateValueAndValidity();
            return;
        }

        this.submit();
    }

    submit() {
        this.loading = true;
        const { asset_id } = this.formGroup.getRawValue();
        const { current_wallet, verifiedAssetIdWhitelist } = this.variablesService;
        const {
            wallet_id,
            verificationAssetsInfoWhitelist$: { value: verificationAssetsInfoWhitelist },
        } = current_wallet;
        const params: ParamsAddCustomAssetId = {
            asset_id,
            wallet_id,
        };

        const isVerifiedAsset: boolean = verifiedAssetIdWhitelist.includes(asset_id);

        if (isVerifiedAsset) {
            current_wallet.removeAssetFromLocalBlacklistVerifiedAssets(asset_id);
            const assetInfo: AssetInfo | undefined = verificationAssetsInfoWhitelist.find(
                (v: AssetInfo): boolean => v.asset_id === asset_id
            );

            if (!assetInfo) {
                this._matDialogRef.close();
                return;
            }

            const asset: AssetBalance = {
                asset_info: {
                    ...assetInfo,
                    asset_id,
                },
                awaiting_in: 0,
                awaiting_out: 0,
                total: 0,
                unlocked: 0,
            };

            this._walletsService.updateWalletInfo(current_wallet);
            this._matDialogRef.close(asset);
        } else {
            this._backendService.addCustomAssetId(params, (status: boolean, { asset_descriptor }: ResponseAddCustomAssetId) => {
                this._ngZone.run(() => {
                    if (status) {
                        const asset: AssetBalance = {
                            asset_info: {
                                ...asset_descriptor,
                                asset_id,
                            },
                            awaiting_in: 0,
                            awaiting_out: 0,
                            total: 0,
                            unlocked: 0,
                        };
                        this._walletsService.updateWalletInfo(current_wallet);
                        this._matDialogRef.close(asset);
                    } else {
                        this.formGroup.controls.asset_id.setErrors({
                            wrongAssetId,
                        });
                        this.loading = false;
                    }
                });
            });
        }
    }
}
