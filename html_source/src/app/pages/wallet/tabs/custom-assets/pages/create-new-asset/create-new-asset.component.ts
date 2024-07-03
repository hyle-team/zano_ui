import { Component, inject } from '@angular/core';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { VariablesService } from '@parts/services/variables.service';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    NonNullableFormBuilder,
    ValidationErrors,
    Validators
} from '@angular/forms';
import {
    ConfirmCreateCustomAssetComponent
} from '../../modals/confirm-create-custom-asset/confirm-create-custom-asset.component';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { AssetDescriptor, DeployAssetParams, Destinations } from '@api/models/custom-asstest.model';
import { filter, take } from 'rxjs/operators';
import { BackendService } from '@api/services/backend.service';
import { Router } from '@angular/router';
import { BigNumber } from 'bignumber.js';
import { moneyToInt } from '@parts/functions/money-to-int';

type CreateNewAssetFrom = FormGroup<{
    ticker: FormControl<string>;
    full_name: FormControl<string>;
    total_max_supply: FormControl<string>;
    current_supply: FormControl<string>;
    decimal_point: FormControl<string>;
    meta_info: FormControl<string>;
    hidden_supply: FormControl<boolean>;
}>;

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

    job_id: number;

    isModalDetailsDialogVisible = false;

    public readonly variablesService: VariablesService = inject(VariablesService);

    private readonly _backendService: BackendService = inject(BackendService);

    private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    public form: CreateNewAssetFrom = this._fb.group(
        {
            ticker: this._fb.control<string>(undefined, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
            full_name: this._fb.control<string>(undefined, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
            total_max_supply: this._fb.control<string>(undefined, [Validators.required]),
            current_supply: this._fb.control<string>(undefined, [Validators.required]),
            decimal_point: this._fb.control<string>(undefined, [Validators.required, Validators.min(0), Validators.max(20)]),
            meta_info: this._fb.control<string>('', [Validators.maxLength(255)]),
            hidden_supply: this._fb.control<boolean>(false),
        },
        {
            validators: [
                (control: AbstractControl) => {
                    const error = {
                        current_supply: 'ERRORS.CANNOT_BE_GREATER_THAN_TOTAL_MAX_SUPPLY,
                    };
                    const total_max_supply = new BigNumber(control.get('total_max_supply').value);
                    const current_supply = new BigNumber(control.get('current_supply').value);

                    if (total_max_supply.isLessThan(current_supply)) {
                        return error;
                    }

                    return null;
                },
                (control: AbstractControl): ValidationErrors => {
                    const error = {
                        total_max_supply: 'ERRORS.TO_BIG_TOTAL_SUPPLY'
                    };
                    const decimal_point = control.get('decimal_point').value;
                    const { value } = control.get('total_max_supply');
                    const total_max_supply = moneyToInt(value, decimal_point);
                    // \(2^{64}-1\) => (18,446,744,073,709,551,615)
                    const max = new BigNumber('18446744073709551615');

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
            decimal_point: new BigNumber(decimal_point).toNumber(),
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
                    this._backendService.asyncCall2a(
                        'call_wallet_rpc',
                        wallet_id,
                        {
                            jsonrpc: '2.0',
                            id: 0,
                            method: 'deploy_asset',
                            params
                        },
                        async (job_id: number): Promise<void> => {
                            this.job_id = job_id;
                            this.isModalDetailsDialogVisible = true;
                        }
                    );
                },
            });
    }

    async handeCloseDetailsModal(success: boolean): Promise<void> {
        this.isModalDetailsDialogVisible = false;
        this.job_id = null;

        if (success) {
            await this._router.navigate(['/wallet/custom-assets']);
        }
    }
}
