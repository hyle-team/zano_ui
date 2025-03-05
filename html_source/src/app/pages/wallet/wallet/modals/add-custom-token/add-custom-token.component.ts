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

@Component({
    selector: 'app-add-custom-token',
    standalone: true,
    templateUrl: './add-custom-token.component.html',
    styleUrls: ['./add-custom-token.component.scss'],
    imports: [CommonModule, FlexModule, TranslateModule, ReactiveFormsModule, LoaderComponent, MatDialogModule]
})
export class AddCustomTokenComponent {
    loading: boolean = false;

    private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    formGroup = this.fb.group<{ asset_id: FormControl<string> }>({
        asset_id: this.fb.control('', Validators.compose([Validators.required, ZanoValidators.hash, Validators.maxLength(64)]))
    });

    public variablesService: VariablesService = inject(VariablesService);

    public backendService: BackendService = inject(BackendService);

    private walletsService: WalletsService = inject(WalletsService);

    private ngZone: NgZone = inject(NgZone);

    private matDialogRef: MatDialogRef<AssetBalance | undefined> = inject(MatDialogRef);

    beforeSubmit(): void {
        if (this.formGroup.invalid) {
            this.formGroup.markAsTouched();
            this.formGroup.updateValueAndValidity();
            return;
        }

        this.submit();
    }

    submit(): void {
        this.loading = true;
        const { asset_id } = this.formGroup.getRawValue();
        const { current_wallet, verifiedAssetIdWhitelist } = this.variablesService;
        const {
            wallet_id,
            verificationAssetsInfoWhitelist$: { value: verificationAssetsInfoWhitelist }
        } = current_wallet;
        const params: ParamsAddCustomAssetId = {
            asset_id,
            wallet_id
        };

        const isVerifiedAsset: boolean = verifiedAssetIdWhitelist.includes(asset_id);

        if (isVerifiedAsset) {
            current_wallet.removeAssetFromLocalBlacklistVerifiedAssets(asset_id);
            const assetInfo: AssetInfo | undefined = verificationAssetsInfoWhitelist.find(
                (v: AssetInfo): boolean => v.asset_id === asset_id
            );

            if (!assetInfo) {
                this.matDialogRef.close();
                return;
            }

            const asset: AssetBalance = {
                asset_info: {
                    ...assetInfo,
                    asset_id
                },
                awaiting_in: 0,
                awaiting_out: 0,
                total: 0,
                unlocked: 0
            };

            this.walletsService.updateWalletInfo(wallet_id);
            this.matDialogRef.close(asset);
        } else {
            this.backendService.addCustomAssetId(params, (status: boolean, { asset_descriptor }: ResponseAddCustomAssetId) => {
                this.ngZone.run(() => {
                    if (status) {
                        const asset: AssetBalance = {
                            asset_info: {
                                ...asset_descriptor,
                                asset_id
                            },
                            awaiting_in: 0,
                            awaiting_out: 0,
                            total: 0,
                            unlocked: 0
                        };
                        this.walletsService.updateWalletInfo(wallet_id);
                        this.matDialogRef.close(asset);
                    } else {
                        this.formGroup.controls.asset_id.setErrors({
                            wrongAssetId
                        });
                        this.loading = false;
                    }
                });
            });
        }
    }
}
