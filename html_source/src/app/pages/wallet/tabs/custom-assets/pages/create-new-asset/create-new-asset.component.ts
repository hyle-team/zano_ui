import { Component, inject } from '@angular/core';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { VariablesService } from '@parts/services/variables.service';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ConfirmCreateCustomAssetComponent } from '../../modals/confirm-create-custom-asset/confirm-create-custom-asset.component';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { AssetDescriptor, DeployAssetParams, Destinations, ResponseDeployAsset } from '@api/models/custom-asstest.model';
import { filter, take } from 'rxjs/operators';
import { BackendService } from '@api/services/backend.service';
import { WalletsService } from '@parts/services/wallets.service';
import { Router } from '@angular/router';
import { BigNumber } from 'bignumber.js';

@Component({
    selector: 'app-create-new-asset',
    templateUrl: './create-new-asset.component.html',
    styleUrls: ['./create-new-asset.component.scss'],
})
export class CreateNewAssetComponent {
    public readonly breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/custom-assets',
            title: 'CREATE_NEW_ASSETS.BREADCRUMBS.BREADCRUMB1',
        },
        {
            title: 'CREATE_NEW_ASSETS.BREADCRUMBS.BREADCRUMB2',
        },
    ];
    public readonly variablesService: VariablesService = inject(VariablesService);
    private readonly _walletsService: WalletsService = inject(WalletsService);
    private readonly _backendService: BackendService = inject(BackendService);
    private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
    public form = this._fb.group(
        {
            ticker: this._fb.control(undefined, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
            full_name: this._fb.control(undefined, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
            total_max_supply: this._fb.control(undefined, [Validators.required]),
            current_supply: this._fb.control(undefined, [Validators.required]),
            decimal_point: this._fb.control(undefined, [Validators.required]),
            meta_info: this._fb.control('', [Validators.maxLength(255)]),
            hidden_supply: this._fb.control(false),
        },
        {
            validators: [
                (control: AbstractControl) => {
                    const error = {
                        current_supply: 'ERRORS.CANNOT_BE_GREATER_THAN_TOTAL_MAX_SUPPLY'
                    };
                    const total_max_supply = new BigNumber(control.get('total_max_supply').value);
                    const current_supply = new BigNumber(control.get('current_supply').value);

                    if (total_max_supply.isLessThan(current_supply)) {
                        return error;
                    }

                    return null;
                },
                (control: AbstractControl): ValidationErrors  => {
                    const error = {
                        total_max_supply: 'ERRORS.TO_BIG_TOTAL_SUPPLY'
                    };
                    const decimal_point = control.get('decimal_point').value;
                    const multiplier = new BigNumber(10).pow(decimal_point);
                    const total_max_supply = new BigNumber(control.get('total_max_supply').value).multipliedBy(multiplier);
                    const max = new BigNumber(18000000).multipliedBy(new BigNumber(10).pow(12));

                    if (max.isLessThan(total_max_supply)) {
                        return error;
                    }

                    return null;
                },
            ],
        }
    );
    private readonly _router: Router = inject(Router);
    private readonly _dialog: Dialog = inject(Dialog);

    submit(): void {
        const { address, wallet_id } = this.variablesService.currentWallet;
        const { ticker, full_name, meta_info, hidden_supply, current_supply, total_max_supply, decimal_point } = this.form.getRawValue();

        const multiplier = new BigNumber(10).pow(decimal_point);
        const divider = 2;
        const destinationAmount = new BigNumber(current_supply).multipliedBy(multiplier).dividedBy(divider).toString();
        const asset_descriptor: AssetDescriptor = {
            ticker,
            full_name,
            meta_info,
            hidden_supply,
            decimal_point,
            total_max_supply: new BigNumber(total_max_supply).multipliedBy(multiplier).toString(),
        };
        const destinations: Destinations = [];

        for (let i = 0; i < divider; i++) {
            destinations.push({
                address,
                amount: destinationAmount,
            });
        }

        const params: DeployAssetParams = {
            asset_descriptor,
            destinations,
        };

        const config: DialogConfig = {
            disableClose: true,
            width: '54rem',
            maxHeight: '90vh',
            data: {
                asset_descriptor: {
                    ...asset_descriptor,
                    current_supply: new BigNumber(current_supply).multipliedBy(multiplier).toString(),
                },
            },
        };
        this._dialog
            .open(ConfirmCreateCustomAssetComponent, config)
            .closed.pipe(filter(Boolean), take(1))
            .subscribe({
                next: () => {
                    this._backendService.call_wallet_rpc(
                        [
                            wallet_id,
                            {
                                jsonrpc: '2.0',
                                id: 0,
                                method: 'deploy_asset',
                                params,
                            },
                        ],
                        async (status: boolean, response_data: ResponseDeployAsset) => {
                            if (response_data?.result?.new_asset_id) {
                                this._walletsService.loadAssetsWhitelist(wallet_id);
                                await this._router.navigate(['/custom-assets']);
                            }
                        }
                    );
                },
            });
    }
}