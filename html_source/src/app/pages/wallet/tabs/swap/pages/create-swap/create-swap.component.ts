import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkWithHref } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsComponent } from '@parts/components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { DefaultImgModule, InputValidateModule, LowerCaseDirective } from '@parts/directives';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IntToMoneyPipe, IntToMoneyPipeModule, MoneyToIntPipe, MoneyToIntPipeModule, ShortStringPipe } from '@parts/pipes';
import { NgSelectModule } from '@ng-select/ng-select';
import { VariablesService } from '@parts/services/variables.service';
import { AssetBalance, AssetInfo } from '@api/models/assets.model';
import { defaultImgSrc, ZanoAssetInfo, zanoAssetInfo } from '@parts/data/assets';
import { regExpAliasName } from '@parts/utils/zano-validators';
import { BackendService } from '@api/services/backend.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, filter, map, startWith, take, tap } from 'rxjs/operators';
import { Aliases } from '@api/models/alias.model';
import { WrapInfoService } from '@api/services/wrap-info.service';
import { WrapInfo } from '@api/models/wrap-info';
import { BigNumber } from 'bignumber.js';
import { assetHasNotBeenAddedToWallet, insuficcientFunds } from '@parts/utils/zano-errors';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { LoaderComponent } from '@parts/components/loader.component';
import { Wallet } from '@api/models/wallet.model';
import { intToMoney } from '@parts/functions/int-to-money';
import { moneyToInt } from '@parts/functions/money-to-int';

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
    ],
    templateUrl: './create-swap.component.html',
    styleUrls: ['./create-swap.component.scss'],
})
export class CreateSwapComponent implements OnInit, OnDestroy {
    zanoAssetInfo: ZanoAssetInfo = zanoAssetInfo;

    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/wallet/swap',
            title: 'CREATE_SWAP.BREADCRUMBS.ITEM1',
        },
        {
            title: 'CREATE_SWAP.BREADCRUMBS.ITEM2',
        },
    ];

    variablesService: VariablesService = inject(VariablesService);

    fb: FormBuilder = inject(FormBuilder);

    aliasAddress: string;

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    aliases$: BehaviorSubject<Aliases> = new BehaviorSubject<Aliases>([]);

    isVisibleDropdownAliases$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    isVisibleDropdownAliasesObservable$: Observable<boolean> = this.isVisibleDropdownAliases$.pipe(delay(150));

    lowerCaseDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    intToMoneyPipe: IntToMoneyPipe = inject(IntToMoneyPipe);

    moneyToIntPipe: MoneyToIntPipe = inject(MoneyToIntPipe);

    wrapInfoService: WrapInfoService = inject(WrapInfoService);

    wrapInfo: WrapInfo;

    errorRpc: { code: number; message: string } = null;

    currentWallet: Wallet = this.variablesService.currentWallet;

    allAssetsInfo: AssetInfo[] = this.currentWallet.allAssetsInfo;

    sendingAssetsInfo$: Observable<AssetInfo[]>;

    sendingDecimalPoint$: Observable<number>;

    receivingAssetsInfo$: Observable<AssetInfo[]>;

    receivingDecimalPoint$: Observable<number>;

    private backendService: BackendService = inject(BackendService);

    private ngZone: NgZone = inject(NgZone);

    form = this.fb.group(
        {
            sending: this.fb.group({
                amount: this.fb.control(null, {
                    validators: [
                        Validators.required,
                        (control: AbstractControl): ValidationErrors | null => {
                            const max: BigNumber = this.variablesService.max_amount_for_send;
                            const amount: BigNumber = new BigNumber(control.value);
                            return amount.isGreaterThan(max) ? { greater_than_max_amount: { max: max.toString() } } : null;
                        },
                        (control: FormControl): ValidationErrors | null => {
                            const isZero = new BigNumber(control.value).eq(0);
                            if (isZero) {
                                return { zero: true };
                            }

                            if (!control.value) {
                                return null;
                            }

                            return null;
                        },
                        (control: FormControl): ValidationErrors | null => {
                            const asset_id = this.form?.controls.sending.controls.asset_id.value;
                            if (!asset_id) {
                                return null;
                            }

                            const asset: AssetBalance | undefined = this.variablesService.currentWallet.balances?.find(
                                v => v.asset_info.asset_id === asset_id
                            );
                            if (asset) {
                                const preparedUnlocked = intToMoney(asset.unlocked, asset.asset_info.decimal_point);
                                return new BigNumber(control.value).isGreaterThan(preparedUnlocked) ? { insuficcientFunds } : null;
                            } else {
                                return { assetHasNotBeenAddedToWallet };
                            }
                        },
                    ],
                }),
                asset_id: this.fb.control(zanoAssetInfo.asset_id, [Validators.required]),
            }),
            receiving: this.fb.group({
                amount: this.fb.control({ value: null, disabled: this.currentWallet.isEmptyAssetsInfoWhitelist }, [
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
                    (control: AbstractControl): ValidationErrors | null => {
                        const max: BigNumber = this.variablesService.max_amount_for_send;
                        const amount: BigNumber = new BigNumber(control.value);
                        return amount.isGreaterThan(max) ? { greater_than_max_amount: { max: max.toString() } } : null;
                    },
                ]),
                asset_id: this.fb.control(
                    {
                        value: this.currentWallet.isEmptyAssetsInfoWhitelist
                            ? null
                            : this.allAssetsInfo[1].asset_id ?? zanoAssetInfo.asset_id,
                        disabled: this.currentWallet.isEmptyAssetsInfoWhitelist,
                    },
                    [Validators.required]
                ),
            }),
            receiverAddress: this.fb.control('', [
                Validators.required,
                (control: FormControl): ValidationErrors | null => {
                    this.aliasAddress = '';
                    if (control.value) {
                        if (control.value.indexOf('@') !== 0) {
                            this.backendService.validateAddress(control.value, (valid_status, data) => {
                                this.ngZone.run(() => {
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
                                });
                            });
                            return control.hasError('address_not_valid') ? { address_not_valid: true } : null;
                        } else {
                            if (!regExpAliasName.test(control.value)) {
                                return { alias_not_valid: true };
                            } else {
                                this.backendService.getAliasInfoByName(control.value.replace('@', ''), (alias_status, alias_data) => {
                                    this.ngZone.run(() => {
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

    private router = inject(Router);

    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this._getAliases();
        this._setSendingAssetIdFromHistoryState();

        this.sendingAssetsInfo$ = this.form.controls.receiving.controls.asset_id.valueChanges.pipe(
            startWith(this.form.controls.receiving.controls.asset_id.value),
            map(asset_id => this.allAssetsInfo.filter(v => v.asset_id !== asset_id))
        );
        this.receivingAssetsInfo$ = this.form.controls.sending.controls.asset_id.valueChanges.pipe(
            startWith(this.form.controls.sending.controls.asset_id.value),
            map(asset_id => this.allAssetsInfo.filter(v => v.asset_id !== asset_id))
        );

        const { currentWallet } = this.variablesService;

        this.sendingDecimalPoint$ = this.form.controls.sending.controls.asset_id.valueChanges.pipe(
            startWith(this.form.controls.sending.controls.asset_id.value),
            map((asset_id: string) => {
                return currentWallet.getBalanceByAssetId(asset_id)?.asset_info.decimal_point ?? 0;
            })
        );

        this.receivingDecimalPoint$ = this.form.controls.receiving.controls.asset_id.valueChanges.pipe(
            startWith(this.form.controls.receiving.controls.asset_id.value),
            map((asset_id: string) => {
                return currentWallet.getBalanceByAssetId(asset_id)?.asset_info.decimal_point ?? 0;
            })
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getSrcByAssetInfo({ asset_id }: AssetInfo): string {
        switch (asset_id) {
            case zanoAssetInfo.asset_id: {
                return zanoAssetInfo.logo;
            }
            default: {
                return defaultImgSrc;
            }
        }
    }

    isVisibleErrorByControl(control: AbstractControl): boolean {
        return control.invalid && (control.dirty || control.touched);
    }

    reverse(): void {
        const { sending, receiving } = this.form.getRawValue();

        const markAllAsTouched = () => {
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

    inputListenReceiverAddressField(event: any): void {
        const {
            target: { value },
        } = event;
        of((value ?? '') as string)
            .pipe(
                tap(v => this.lowerCaseDisabled$.next(v.indexOf('@') !== 0)),
                tap(v => this.isVisibleDropdownAliases$.next(!!v.length && v.indexOf('@') === 0)),
                filter(v => v.indexOf('@') === 0),
                take(1)
            )
            .subscribe({
                next: v => {
                    const filteredAliases = this.variablesService.aliases.filter(({ name }) => {
                        return name.indexOf(v) > -1;
                    });
                    this.aliases$.next(filteredAliases);
                },
            });
    }

    pasteListenReceiverAddressField(event: any): void {
        event.preventDefault();
        const { clipboardData } = event;
        let value = clipboardData.getData('Text') ?? '';
        this.lowerCaseDisabled$.next(value.indexOf('@') !== 0);

        if (value.indexOf('@') === 0) {
            value = value.toLowerCase();
        }
        this.form.controls.receiverAddress.patchValue(value);
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
        const { wallet_id } = this.variablesService.currentWallet;
        const { default_fee_big } = this.variablesService;

        const { currentWallet } = this.variablesService;

        const sendingAsset: AssetInfo | undefined = currentWallet.getAssetInfoByAssetId(sending.asset_id);
        const receivingAsset: AssetInfo | undefined = currentWallet.getAssetInfoByAssetId(receiving.asset_id);

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
            const aliasName = receiverAddress;
            const alias = this.aliases$.value.find(({ name }) => name === aliasName);

            if (!alias) {
                this.form.controls.receiverAddress.setErrors({
                    alias_not_found: true,
                });
                return;
            }

            params2.params['destination_address'] = alias.address;
        } else {
            params2.params['destination_address'] = receiverAddress;
        }

        this.backendService.call_wallet_rpc([wallet_id, params2], (status, response_data) => {
            if (response_data?.result) {
                this.ngZone.run(() => {
                    this.router
                        .navigateByUrl('/wallet/swap-proposal-hex', {
                            state: {
                                hex_raw_proposal: response_data.result['hex_raw_proposal'],
                            },
                        })
                        .then();
                });
            } else {
                this.ngZone.run(() => {
                    this.errorRpc = response_data.error;
                    this.loading$.next(false);
                });
            }
        });
    }

    private _setSendingAssetIdFromHistoryState(): void {
        const state = history.state || {};
        const assetInfo: AssetInfo = state['assetInfo'];
        if (assetInfo) {
            const {
                asset_id,
            } = assetInfo;
            this.form.patchValue({
                sending: {
                    asset_id,
                },
            });
        }
    }

    private _getAliases(): void {
        const { aliases } = this.variablesService;
        this.aliases$.next(aliases);
    }
}
