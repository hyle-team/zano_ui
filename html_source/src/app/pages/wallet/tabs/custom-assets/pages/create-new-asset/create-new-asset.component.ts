import { Component, inject, NgZone } from '@angular/core';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { VariablesService } from '@parts/services/variables.service';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ConfirmCreateCustomAssetComponent } from '../../modals/confirm-create-custom-asset/confirm-create-custom-asset.component';
import { AssetDescriptor, DeployAssetParams, Destinations } from '@api/models/custom-asstest.model';
import { filter, take } from 'rxjs/operators';
import { BackendService } from '@api/services/backend.service';
import { Router } from '@angular/router';
import { BigNumber } from 'bignumber.js';
import { intToMoney } from '@parts/functions/int-to-money';
import { moneyToInt } from '@parts/functions/money-to-int';
import { TransactionDetailsForCustomAssetsComponent } from '../../modals/transaction-details-for-custom-assets/transaction-details-for-custom-assets.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

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

    public readonly variablesService: VariablesService = inject(VariablesService);

    private readonly _backendService: BackendService = inject(BackendService);

    private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    public form: CreateNewAssetFrom = this._fb.group(
        {
            ticker: this._fb.control<string>('', [
                Validators.required,
                Validators.pattern(/^[A-Za-z0-9]+$/),
                Validators.minLength(1),
                Validators.maxLength(14),
            ]),
            full_name: this._fb.control<string>('', [
                Validators.pattern(/^[A-Za-z0-9.,:!\-() ]+$/),
                Validators.minLength(0),
                Validators.maxLength(400),
            ]),
            total_max_supply: this._fb.control<string>(undefined, [Validators.required]),
            current_supply: this._fb.control<string>(undefined, [Validators.required]),
            decimal_point: this._fb.control<string>('12', [Validators.required, Validators.min(0), Validators.max(18)]),
            meta_info: this._fb.control<string>('', [Validators.maxLength(255)]),
            hidden_supply: this._fb.control<boolean>(false),
        },
        {
            validators: [
                (control: AbstractControl) => {
                    const error = {
                        current_supply: 'ERRORS.CANNOT_BE_GREATER_THAN_TOTAL_MAX_SUPPLY',
                    };
                    const total_max_supply = new BigNumber(control.get('total_max_supply').value);
                    const current_supply = new BigNumber(control.get('current_supply').value);

                    if (total_max_supply.isLessThan(current_supply)) {
                        return error;
                    }

                    return null;
                },
                (control: AbstractControl): ValidationErrors => {
                    const { maximum_value } = this.variablesService;
                    const { value: decimal_point } = control.get('decimal_point');
                    const { value: total_max_supply } = control.get('total_max_supply');

                    const prepared_total_max_supply = new BigNumber(total_max_supply);
                    const max = new BigNumber(intToMoney(maximum_value, +decimal_point || 0));
                    const error = { greater_than_max: { max: max.toString() } };

                    if (prepared_total_max_supply.isGreaterThan(max)) {
                        return error;
                    }

                    return null;
                },
            ],
        }
    );

    private readonly _router: Router = inject(Router);

    private readonly _matDialog: MatDialog = inject(MatDialog);

    private readonly _ngZone: NgZone = inject(NgZone);

    details(job_id: number): void {
        const config: MatDialogConfig = {
            data: {
                job_id,
            },
            disableClose: true,
        };
        this._matDialog
            .open(TransactionDetailsForCustomAssetsComponent, config)
            .afterClosed()
            .pipe(filter(Boolean), take(1))
            .subscribe({
                next: async () => {
                    await this._ngZone.run(async () => {
                        await this._router.navigate(['/wallet/custom-assets']);
                    });
                },
            });
    }

    submit(): void {
        const { address, wallet_id } = this.variablesService.currentWallet;
        const { ticker, full_name, meta_info, hidden_supply, current_supply, total_max_supply, decimal_point } = this.form.getRawValue();

        let countDestination = 1;
        let destinationAmount: string = moneyToInt(current_supply, decimal_point).toString();
        const halfDestinationAmount: string = new BigNumber(destinationAmount).div(2).toString();

        if (
            !halfDestinationAmount.includes('.') &&
            new BigNumber(halfDestinationAmount).plus(halfDestinationAmount).eq(destinationAmount)
        ) {
            countDestination = 2;
            destinationAmount = halfDestinationAmount;
        }

        const asset_descriptor: AssetDescriptor = {
            ticker,
            full_name,
            meta_info,
            hidden_supply,
            decimal_point: new BigNumber(decimal_point).toNumber(),
            total_max_supply: moneyToInt(total_max_supply, decimal_point).toString(),
        };
        const destinations: Destinations = [];

        for (let i = 0; i < countDestination; i++) {
            destinations.push({
                address,
                amount: destinationAmount,
                asset_id: '0000000000000000000000000000000000000000000000000000000000000000',
            });
        }

        const params: DeployAssetParams = {
            asset_descriptor,
            destinations,
        };

        const config: MatDialogConfig = {
            disableClose: true,
            data: {
                asset_descriptor: {
                    ...asset_descriptor,
                    current_supply: moneyToInt(current_supply, decimal_point).toString(),
                },
            },
        };
        this._matDialog
            .open(ConfirmCreateCustomAssetComponent, config)
            .afterClosed()
            .pipe(filter(Boolean), take(1))
            .subscribe({
                next: () => {
                    this._backendService.asyncCall2a(
                        'call_wallet_rpc',
                        wallet_id,
                        {
                            jsonrpc: '2.0',
                            id: 0,
                            method: 'deploy_asset',
                            params,
                        },
                        async (job_id: number): Promise<void> => {
                            this._ngZone.run(() => this.details(job_id));
                        }
                    );
                },
            });
    }
}
