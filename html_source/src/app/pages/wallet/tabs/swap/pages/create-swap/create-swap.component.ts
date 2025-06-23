import { ChangeDetectorRef, Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkWithHref } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsComponent } from '@parts/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { DefaultImgModule, InputValidateModule, LowerCaseDirective } from '@parts/directives';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { IntToMoneyPipeModule, MoneyToIntPipeModule, ShortStringPipe } from '@parts/pipes';
import { NgSelectModule } from '@ng-select/ng-select';
import { VariablesService } from '@parts/services/variables.service';
import { AssetBalance, AssetInfo } from '@api/models/assets.model';
import { ZANO_ASSET_INFO } from '@parts/data/assets';
import { REG_EXP_ALIAS_NAME } from '@parts/utils/zano-validators';
import { BackendService } from '@api/services/backend.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { BigNumber } from 'bignumber.js';
import { assetHasNotBeenAddedToWallet, insufficientFunds } from '@parts/utils/zano-errors';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { LoaderComponent } from '@parts/components/loader.component';
import { Wallet } from '@api/models/wallet.model';
import { intToMoney } from '@parts/functions/int-to-money';
import { moneyToInt } from '@parts/functions/money-to-int';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { WalletsService } from '@parts/services/wallets.service';
import { MatIconModule } from '@angular/material/icon';
import { GetLogoByAssetInfoPipe } from '@parts/pipes/get-logo-by-asset-info.pipe';
import { MAXIMUM_VALUE } from '@parts/data/constants';

@Component({
    selector: 'app-create-swap',
    standalone: true,
    imports: [
        CommonModule,
        RouterLinkWithHref,
        TranslateModule,
        BreadcrumbsComponent,
        InputValidateModule,
        ReactiveFormsModule,
        DefaultImgModule,
        NgSelectModule,
        LowerCaseDirective,
        ShortStringPipe,
        FormsModule,
        IntToMoneyPipeModule,
        MoneyToIntPipeModule,
        LoaderComponent,
        MatAutocompleteModule,
        MatOptionModule,
        MatIconModule,
        GetLogoByAssetInfoPipe,
    ],
    templateUrl: './create-swap.component.html',
    styleUrls: ['./create-swap.component.scss'],
})
export class CreateSwapComponent implements OnInit, OnDestroy {
    readonly breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/wallet/swap',
            title: 'CREATE_SWAP.BREADCRUMBS.ITEM1',
        },
        {
            title: 'CREATE_SWAP.BREADCRUMBS.ITEM2',
        },
    ];

    readonly variablesService: VariablesService = inject(VariablesService);

    private readonly _fb: FormBuilder = inject(FormBuilder);

    private readonly _backendService: BackendService = inject(BackendService);

    private readonly _ngZone: NgZone = inject(NgZone);

    private readonly _router: Router = inject(Router);

    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    private readonly _walletsService: WalletsService = inject(WalletsService);

    aliasAddress: string;

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    lowerCaseDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    errorRpc: { code: number; message: string } | undefined;

    currentWallet: Wallet = this.variablesService.current_wallet;

    sendingAssetsInfo$: Observable<AssetInfo[]>;

    sendingDecimalPoint$: Observable<number>;

    receivingAssetsInfo$: Observable<AssetInfo[]>;

    receivingDecimalPoint$: Observable<number>;

    addressItems$: Observable<string[]>;

    loadingAddressItems$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    form: FormGroup<{
        sending: FormGroup<{
            amount: FormControl<string>;
            asset_id: FormControl<string>;
        }>;
        receiving: FormGroup<{
            amount: FormControl<string>;
            asset_id: FormControl<string>;
        }>;
        receiverAddress: FormControl<string>;
    }>;

    errorMessages: { [key: string]: string | undefined } = {
        receiverAddress: undefined,
    };

    private _openedWalletItems: string[] = this._walletsService.opened_wallet_items;

    private _aliasItems: string[] = this.variablesService.all_aliases
        .filter(Boolean)
        .map((alias_info) => (alias_info.alias ? '@' + alias_info.alias : alias_info.address));

    private _destroy$ = new Subject<void>();

    ngOnInit(): void {
        this._createForm();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    isVisibleErrorByControl(control: AbstractControl): boolean {
        return control.invalid && (control.dirty || control.touched);
    }

    isVisibleErrorByForm(form: FormGroup): boolean {
        return form.invalid && (form.dirty || form.touched);
    }

    reverse(): void {
        const { sending, receiving } = this.form.getRawValue();

        const markAllAsTouched = (): void => {
            this.form.controls.sending.markAllAsTouched();
            this.form.controls.receiving.markAllAsTouched();
        };

        markAllAsTouched();

        this.form.patchValue({
            sending: receiving,
            receiving: sending,
        });
        this.form.controls.sending.controls.amount.updateValueAndValidity();
        this.form.controls.receiving.controls.amount.updateValueAndValidity();
    }

    updateReceiverAddressErrorMessage(): void {
        const {
            controls: { receiverAddress },
        } = this.form;
        let message: string | undefined;

        switch (true) {
            case receiverAddress.hasError('address_not_valid'): {
                message = 'SEND.FORM_ERRORS.ADDRESS_NOT_VALID';
                break;
            }
            case receiverAddress.hasError('alias_not_found'): {
                message = 'SEND.FORM_ERRORS.ALIAS_NOT_FOUND';
                break;
            }
            case receiverAddress.hasError('alias_not_valid'): {
                message = 'SEND.FORM_ERRORS.ALIAS_NOT_VALID';
                break;
            }
            case receiverAddress.hasError('required'): {
                message = 'ERRORS.REQUIRED';
                break;
            }
        }
        this.errorMessages['receiverAddress'] = message;
    }

    pasteListenReceiverAddressField(event: ClipboardEvent): void {
        event.preventDefault();
        const {
            controls: { receiverAddress },
        } = this.form;
        const { clipboardData } = event;
        let value: string = clipboardData.getData('Text') ?? '';
        this.lowerCaseDisabled$.next(value.indexOf('@') !== 0);

        if (value.indexOf('@') === 0) {
            value = value.toLowerCase();
        }

        receiverAddress.patchValue(value);
    }

    trackByFn(index: number, value: string): number | string {
        return value ?? index;
    }

    beforeSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.form.updateValueAndValidity();
            return;
        }
        this.submit();
    }

    submit(): void {
        this.loading$.next(true);
        const { sending, receiving, receiverAddress } = this.form.getRawValue();
        const { wallet_id } = this.variablesService.current_wallet;
        const { default_fee_big } = this.variablesService;

        const { current_wallet } = this.variablesService;

        const sendingAsset: AssetInfo | undefined = current_wallet.getAssetInfoByAssetId(sending.asset_id);
        const receivingAsset: AssetInfo | undefined = current_wallet.getAssetInfoByAssetId(receiving.asset_id);

        if (!sendingAsset) {
            this.form.controls.sending.controls.asset_id.setErrors({
                alias_not_found: true,
            });
            return;
        }

        if (!receivingAsset) {
            this.form.controls.receiving.controls.asset_id.setErrors({
                alias_not_found: true,
            });
            return;
        }

        const params2: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: 0,
            method: 'ionic_swap_generate_proposal',
            params: {
                proposal: {
                    to_finalizer: [
                        {
                            asset_id: sending.asset_id,
                            amount: moneyToInt(sending.amount, sendingAsset.decimal_point),
                        },
                    ],
                    to_initiator: [
                        {
                            asset_id: receiving.asset_id,
                            amount: moneyToInt(receiving.amount, receivingAsset.decimal_point),
                        },
                    ],
                    mixins: 10,
                    fee_paid_by_a: default_fee_big,
                    expiration_time: 0,
                },
            },
        };

        if (receiverAddress.indexOf('@') === 0) {
            params2.params['destination_address'] = this.aliasAddress;
        } else {
            params2.params['destination_address'] = receiverAddress;
        }

        this._backendService.call_wallet_rpc([wallet_id, params2], (status, response_data) => {
            if (response_data?.result) {
                this._ngZone.run(() => {
                    this._router
                        .navigateByUrl('/wallet/swap-proposal-hex', {
                            state: {
                                hex_raw_proposal: response_data.result['hex_raw_proposal'],
                            },
                        })
                        .then();
                });
            } else {
                this._ngZone.run(() => {
                    this.errorRpc = response_data.error;
                    this.loading$.next(false);
                });
            }
        });
    }

    private _formListeners(): void {
        const { balances$ } = this.currentWallet;
        this.sendingAssetsInfo$ = this.form.controls.receiving.controls.asset_id.valueChanges.pipe(
            startWith(this.form.controls.receiving.controls.asset_id.value),
            switchMap((asset_id) =>
                balances$.pipe(
                    map((balances) => balances.filter((v) => v.asset_info.asset_id !== asset_id)),
                    map((balances) => balances.map(({ asset_info }) => asset_info))
                )
            )
        );
        this.receivingAssetsInfo$ = this.form.controls.sending.controls.asset_id.valueChanges.pipe(
            startWith(this.form.controls.sending.controls.asset_id.value),
            switchMap((asset_id) =>
                balances$.pipe(
                    map((balances) => balances.filter((v) => v.asset_info.asset_id !== asset_id)),
                    map((balances) => balances.map(({ asset_info }) => asset_info))
                )
            )
        );

        const { current_wallet } = this.variablesService;

        this.sendingDecimalPoint$ = this.form.controls.sending.controls.asset_id.valueChanges.pipe(
            startWith(this.form.controls.sending.controls.asset_id.value),
            map((asset_id: string) => {
                return current_wallet.getBalanceByAssetId(asset_id)?.asset_info.decimal_point ?? 0;
            })
        );

        this.receivingDecimalPoint$ = this.form.controls.receiving.controls.asset_id.valueChanges.pipe(
            startWith(this.form.controls.receiving.controls.asset_id.value),
            map((asset_id: string) => {
                return current_wallet.getBalanceByAssetId(asset_id)?.asset_info.decimal_point ?? 0;
            })
        );

        this.addressItems$ = this.form.controls.receiverAddress.valueChanges.pipe(
            startWith(this.form.controls.receiverAddress.value),
            tap((value) => {
                const condition = value[0] === '@';
                this.lowerCaseDisabled$.next(!condition);
                this.loadingAddressItems$.next(condition);
            }),
            debounceTime(250),
            map((value) => {
                if (!value?.length) {
                    return this._openedWalletItems;
                }
                if (value[0] === '@') {
                    return this._aliasItems.filter((alias) => {
                        return alias.includes(value);
                    });
                }
                return [];
            }),
            tap(() => this.loadingAddressItems$.next(false))
        );
    }

    private _createForm(): void {
        this.form = this._fb.group(
            {
                sending: this._fb.group(
                    {
                        amount: this._fb.control(null, {
                            validators: [
                                Validators.required,
                                ({ value }: FormControl): ValidationErrors | null => {
                                    const amount: BigNumber = new BigNumber(value);

                                    if (amount.eq(0)) {
                                        return { zero: true };
                                    }

                                    return null;
                                },
                            ],
                        }),
                        asset_id: this._fb.control(ZANO_ASSET_INFO.asset_id, [Validators.required]),
                    },
                    {
                        validators: [
                            (form: FormGroup): ValidationErrors | null => {
                                const { value: asset_id } = form.get('asset_id');
                                const { value: amount } = form.get('amount');
                                const preparedAmount = new BigNumber(amount);

                                if (!asset_id) {
                                    return null;
                                }

                                const asset: AssetBalance | undefined = this.variablesService.current_wallet.balances?.find(
                                    (v) => v.asset_info.asset_id === asset_id
                                );
                                if (asset) {
                                    const {
                                        asset_info: { decimal_point },
                                        unlocked,
                                    } = asset;
                                    const maximum_amount_by_decimal_point = intToMoney(MAXIMUM_VALUE, decimal_point);
                                    if (preparedAmount.isGreaterThan(maximum_amount_by_decimal_point)) {
                                        return { greater_max: { max: maximum_amount_by_decimal_point } };
                                    }

                                    const preparedUnlocked = intToMoney(unlocked, decimal_point);
                                    return preparedAmount.isGreaterThan(preparedUnlocked) ? { insufficientFunds } : null;
                                } else {
                                    return { assetHasNotBeenAddedToWallet };
                                }
                            },
                        ],
                    }
                ),
                receiving: this._fb.group(
                    {
                        amount: this._fb.control(
                            {
                                value: null,
                                disabled: this.currentWallet.balances.length === 1,
                            },
                            [
                                Validators.required,
                                (control: FormControl): ValidationErrors | null => {
                                    if (!control.value) {
                                        return null;
                                    }

                                    if (control.value === 0) {
                                        return { zero: true };
                                    }
                                    return null;
                                },
                            ]
                        ),
                        asset_id: this._fb.control(
                            {
                                value:
                                    this.currentWallet.balances.length <= 1
                                        ? null
                                        : this.currentWallet.balances[1]?.asset_info?.asset_id ?? ZANO_ASSET_INFO.asset_id,
                                disabled: this.currentWallet.balances.length <= 1,
                            },
                            [Validators.required]
                        ),
                    },
                    {
                        validators: [
                            (form: FormGroup): ValidationErrors | null => {
                                const asset_id = form.controls.asset_id.value;
                                const amount = new BigNumber(form.controls.amount.value);
                                if (!asset_id) {
                                    return null;
                                }

                                const asset: AssetBalance | undefined = this.variablesService.current_wallet.balances?.find(
                                    (v) => v.asset_info.asset_id === asset_id
                                );
                                if (asset) {
                                    const {
                                        asset_info: { decimal_point },
                                    } = asset;
                                    const maximum_amount_by_decimal_point = intToMoney(MAXIMUM_VALUE, decimal_point);
                                    if (amount.isGreaterThan(maximum_amount_by_decimal_point)) {
                                        return { greater_max: { max: maximum_amount_by_decimal_point } };
                                    }
                                    return null;
                                } else {
                                    return { assetHasNotBeenAddedToWallet };
                                }
                            },
                        ],
                    }
                ),
                receiverAddress: this._fb.control('', [
                    Validators.required,
                    (control: FormControl): ValidationErrors | null => {
                        this.aliasAddress = '';
                        if (control.value) {
                            if (control.value.indexOf('@') !== 0) {
                                this._backendService.validateAddress(control.value, (valid_status) => {
                                    this._ngZone.run(() => {
                                        if (valid_status === false) {
                                            control.setErrors(Object.assign({ address_not_valid: true }, control.errors));
                                        } else {
                                            if (control.hasError('address_not_valid')) {
                                                delete control.errors['address_not_valid'];
                                                if (Object.keys(control.errors).length === 0) {
                                                    control.setErrors(null);
                                                }
                                            }
                                        }
                                        this._cdr.markForCheck();
                                        this._cdr.detectChanges();
                                    });
                                });
                                return control.hasError('address_not_valid') ? { address_not_valid: true } : null;
                            } else {
                                if (!REG_EXP_ALIAS_NAME.test(control.value)) {
                                    return { alias_not_valid: true };
                                } else {
                                    this._backendService.getAliasInfoByName(control.value.replace('@', ''), (alias_status, alias_data) => {
                                        this._ngZone.run(() => {
                                            this.aliasAddress = alias_data.address;
                                            if (alias_status) {
                                                if (control.hasError('alias_not_found')) {
                                                    delete control.errors['alias_not_found'];
                                                    if (Object.keys(control.errors).length === 0) {
                                                        control.setErrors(null);
                                                    }
                                                }
                                            } else {
                                                control.setErrors(Object.assign({ alias_not_found: true }, control.errors));
                                            }
                                            this._cdr.markForCheck();
                                            this._cdr.detectChanges();
                                        });
                                    });
                                }
                                return control.hasError('alias_not_found') ? { alias_not_found: true } : null;
                            }
                        }
                        return null;
                    },
                ]),
            },
            {
                validators: [
                    (control: AbstractControl): ValidationErrors | null => {
                        const condition = control.get('sending').get('asset_id').value === control.get('receiving').get('asset_id').value;
                        if (condition) {
                            control.get('receiving').get('asset_id').setErrors({ sameAssetsId: true });
                        } else {
                            control.get('receiving').get('asset_id').setErrors(null);
                        }
                        return null;
                    },
                ],
            }
        );

        this._setSendingAssetIdFromHistoryState();

        this._formListeners();
    }

    private _setSendingAssetIdFromHistoryState(): void {
        const state = history.state || {};
        const history_asset: AssetBalance = state['asset'];
        if (history_asset) {
            const {
                asset_info: { asset_id },
            } = history_asset;
            this.form.patchValue({
                sending: {
                    asset_id,
                },
            });

            if (this.form.getRawValue().receiving.asset_id === asset_id) {
                for (const balance of this.currentWallet.balances) {
                    if (balance.asset_info.asset_id !== asset_id) {
                        this.form.patchValue({
                            receiving: {
                                asset_id: balance.asset_info.asset_id,
                            },
                        });
                        break;
                    }
                }
            }
        }
    }
}
