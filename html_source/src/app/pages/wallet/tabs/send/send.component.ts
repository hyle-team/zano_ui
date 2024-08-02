import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { BigNumber } from 'bignumber.js';
import { MIXIN } from '@parts/data/constants';
import { debounceTime, map, retry, startWith, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { AssetBalance } from '@api/models/assets.model';
import { regExpAliasName } from '@parts/utils/zano-validators';
import { insuficcientFunds } from '@parts/utils/zano-errors';
import { DeeplinkParams, defaultSendMoneyParams } from '@api/models/wallet.model';
import { WrapInfo } from '@api/models/wrap-info';
import { WrapInfoService } from '@api/services/wrap-info.service';
import { SendMoneyParams } from '@api/models/send-money.model';
import { defaultImgSrc, zanoAssetInfo } from '@parts/data/assets';
import { moneyToInt } from '@parts/functions/money-to-int';
import { intToMoney } from '@parts/functions/int-to-money';
import { TranslateService } from '@ngx-translate/core';
import { WalletsService } from '@parts/services/wallets.service';

@Component({
    selector: 'app-send',
    templateUrl: 'send.component.html',
    styles: [
        `
            :host {
                width: 100%;
            }
        `,
    ],
})
export class SendComponent implements OnInit, OnDestroy {
    job_id: number;

    isSendModalState: boolean = false;

    isSendDetailsModalState: boolean = false;

    wrapInfo: WrapInfo;

    loadingWrapInfo$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    isVisibleWrapInfoState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    aliasAddress: string;

    isVisibleAdditionalOptionsState: boolean = false;

    variablesService: VariablesService = inject(VariablesService);

    wrapInfoService: WrapInfoService = inject(WrapInfoService);

    assetItems$: Observable<(AssetBalance & { disabled: boolean })[]> = combineLatest([
        this.variablesService.currentWallet.balances$,
        this.isVisibleWrapInfoState$,
    ]).pipe(
        map(([balances, disabled]) => {
            const items: (AssetBalance & { disabled: boolean })[] = [];

            balances.forEach((balance: AssetBalance) => {
                const {
                    asset_info: { asset_id },
                } = balance;

                if (asset_id === zanoAssetInfo.asset_id) {
                    return items.push({ ...balance, disabled: false });
                }

                return items.push({ ...balance, disabled });
            });

            return items;
        })
    );

    lowerCaseDisabled$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    form: FormGroup<{
        wallet_id: FormControl<number>;
        address: FormControl<string>;
        amount: FormControl<string>;
        comment: FormControl<string>;
        asset_id: FormControl<string>;
        mixin: FormControl<number>;
        fee: FormControl<string>;
        hide: FormControl<boolean>;
    }>;

    addressItems$: Observable<string[]>;

    loadingAddressItems$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    decimal_point$: Observable<number>;

    errorMessages: { [key: string]: string | undefined } = {
        address: undefined,
        fee: undefined,
    };

    private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    private _destroy$: Subject<void> = new Subject<void>();

    private _backendService: BackendService = inject(BackendService);

    private _ngZone: NgZone = inject(NgZone);

    private _translateService: TranslateService = inject(TranslateService);

    private _walletsService: WalletsService = inject(WalletsService);

    private _openedWalletItems: string[] = this._walletsService.wallets.map(({ address, alias }) => alias?.name ?? address);

    private _aliasItems: string[] = this.variablesService.aliases.map(({ name }) => name);

    readonly zanoAssetInfo = zanoAssetInfo;

    ngOnInit(): void {
        this._getWrapInfo();

        this._createForm();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    updateAddressErrorMessage(): void {
        const {
            controls: { address },
        } = this.form;
        let message: string | undefined;

        switch (true) {
            case address.hasError('address_not_valid'): {
                message = 'SEND.FORM_ERRORS.ADDRESS_NOT_VALID';
                break;
            }
            case address.hasError('alias_not_found'): {
                message = 'SEND.FORM_ERRORS.ALIAS_NOT_FOUND';
                break;
            }
            case address.hasError('alias_not_valid'): {
                message = 'SEND.FORM_ERRORS.ALIAS_NOT_VALID';
                break;
            }
            case address.hasError('required'): {
                message = 'ERRORS.REQUIRED';
                break;
            }
        }
        this.errorMessages['address'] = message;
    }

    updateFeeErrorMessage(): void {
        const {
            controls: { fee },
        } = this.form;
        let message: string | undefined;

        switch (true) {
            case fee.hasError('less_min'): {
                const { default_fee } = this.variablesService;
                message = this._translateService.instant('SEND.FORM_ERRORS.FEE_MINIMUM', { fee: default_fee });
                break;
            }
            case fee.hasError('required'): {
                message = 'SEND.FORM_ERRORS.FEE_REQUIRED';
                break;
            }
            case fee.hasError('greater_than_max_amount'): {
                const { maximum_value } = this.variablesService;
                const { decimal_point } = zanoAssetInfo;
                const max = intToMoney(maximum_value, decimal_point);
                message = this._translateService.instant('ERRORS.MAX', { max });
            }
        }

        this.errorMessages['fee'] = message;
    }

    getSrcByAsset({ asset_info: { asset_id } }: AssetBalance): string {
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

    beforeSubmit(): void {
        this.isSendModalState = true;
    }

    handleConfirmed(confirmed: boolean): void {
        this.isSendModalState = false;
        if (confirmed) {
            this.submit();
        }
    }

    submit(): void {
        let sendMoneyParams: SendMoneyParams = this.form.getRawValue();
        const { address, asset_id, amount } = sendMoneyParams;

        const { currentWallet } = this.variablesService;
        const asset: AssetBalance | undefined = currentWallet.getBalanceByAssetId(asset_id);

        if (asset) {
            sendMoneyParams = {
                ...sendMoneyParams,
                amount,
            };
        } else {
            this.form.controls.asset_id.setErrors({
                asset_not_found: true,
            });
            return;
        }

        if (address.indexOf('@') === 0) {
            const aliasName = address;
            const { aliases } = this.variablesService;
            const alias = aliases.find(({ name }) => name === aliasName);

            if (!alias) {
                this.form.controls.address.setErrors({
                    alias_not_found: true,
                });
                return;
            }

            sendMoneyParams = {
                ...sendMoneyParams,
                address: alias.address,
            };
        }

        this._backendService.sendMoney(sendMoneyParams, (job_id: number) => {
            this._ngZone.run(() => {
                this.job_id = job_id;
                this.isSendDetailsModalState = true;
                this.variablesService.currentWallet.sendMoneyParams = null;
            });
        });
    }

    getReceivedValue(): number | BigNumber {
        const {
            controls: {
                amount: { value: amount },
            },
        } = this.form;
        const preparedAmount: BigNumber = moneyToInt(amount);

        const { tx_cost: { zano_needed_for_erc20 } } = this.wrapInfo;
        const needed: BigNumber = new BigNumber(zano_needed_for_erc20);

        if (preparedAmount && needed) {
            return preparedAmount.minus(needed);
        }
        return 0;
    }

    handeCloseSendDetailsModal(success: boolean): void {
        this.isSendDetailsModalState = false;
        this.job_id = null;

        if (success) {
            const { currentWallet } = this.variablesService;
            const { wallet_id } = currentWallet;
            currentWallet.sendMoneyParams = null;

            this.form.reset({ ...defaultSendMoneyParams, wallet_id }, { emitEvent: false });
        }
    }

    pasteListenAddressField(event: ClipboardEvent): void {
        event.preventDefault();
        const {
            controls: { address },
        } = this.form;
        const { clipboardData } = event;
        let value: string = clipboardData.getData('Text') ?? '';
        this.lowerCaseDisabled$.next(value.indexOf('@') !== 0);

        if (value.indexOf('@') === 0) {
            value = value.toLowerCase();
        }

        address.patchValue(value);
    }

    trackByFn(index: number, value: string): number | string {
        return value ?? index;
    }

    private _createForm(): void {
        const { currentWallet, default_fee, maxCommentLength, maximum_value } = this.variablesService;

        let params: SendMoneyParams;

        if (currentWallet.sendMoneyParams) {
            params = currentWallet.sendMoneyParams;
        } else {
            params = {
                ...defaultSendMoneyParams,
                wallet_id: currentWallet.wallet_id,
                fee: default_fee,
            };
        }

        if (currentWallet.is_auditable && !currentWallet.is_watch_only) {
            params.hide = true;
        }

        if (currentWallet.is_auditable) {
            params.mixin = 0;
        }

        const state = history.state || {};
        const history_asset: AssetBalance = state['asset'];

        if (history_asset) {
            const {
                asset_info: { asset_id, decimal_point },
            } = history_asset;
            params.asset_id = asset_id;
            if (params.amount) {
                params.amount = intToMoney(moneyToInt(params.amount, decimal_point), decimal_point);
            }
        }

        this.form = this._fb.group(
            {
                wallet_id: this._fb.control<number>(params.wallet_id, {
                    validators: [Validators.required],
                }),
                address: this._fb.control<string>(params.address, {
                    validators: [
                        Validators.required,
                        (control: AbstractControl): ValidationErrors | null => {
                            this.aliasAddress = '';
                            if (control.value) {
                                if (control.value.indexOf('@') !== 0) {
                                    this._backendService.validateAddress(control.value, (valid_status, data) => {
                                        this._ngZone.run(() => {
                                            this.isVisibleWrapInfoState$.next(data.error_code === 'WRAP');
                                            if (data.error_code === 'WRAP') {
                                                this.form.controls.asset_id.patchValue(zanoAssetInfo.asset_id);
                                            }

                                            if (valid_status === false && !this.isVisibleWrapInfoState$.value) {
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
                                        this._backendService.getAliasInfoByName(
                                            control.value.replace('@', ''),
                                            (alias_status, alias_data) => {
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
                                                });
                                            }
                                        );
                                    }
                                    return control.hasError('alias_not_found') ? { alias_not_found: true } : null;
                                }
                            }
                            return null;
                        },
                    ],
                }),
                amount: this._fb.control<string>(params.amount, {
                    validators: [
                        Validators.required,
                        ({ value }: AbstractControl): ValidationErrors | null => {
                            const isZero: boolean = new BigNumber(value).eq(0);

                            if (isZero) {
                                return { zero: true };
                            }

                            const amount: BigNumber = moneyToInt(value);

                            if (this.isVisibleWrapInfoState$.value) {
                                if (!this.wrapInfo) {
                                    return { wrap_info_null: true };
                                }
                                if (amount.isGreaterThan(new BigNumber(this.wrapInfo.unwraped_coins_left))) {
                                    return { great_than_unwraped_coins: true };
                                }
                                if (amount.isLessThan(new BigNumber(this.wrapInfo.tx_cost.zano_needed_for_erc20))) {
                                    return { less_than_zano_needed: true };
                                }
                            }

                            return null;
                        },
                    ],
                }),
                comment: this._fb.control<string>(params.comment, {
                    validators: [Validators.maxLength(maxCommentLength)],
                }),
                asset_id: this._fb.control<string>(params.asset_id, {
                    validators: [Validators.required],
                }),
                mixin: this._fb.control<number>(
                    { value: params.mixin, disabled: currentWallet.is_auditable },
                    {
                        validators: [Validators.required, Validators.min(0), Validators.max(1000)],
                    }
                ),
                fee: this._fb.control<string>(params.fee, {
                    validators: [
                        Validators.required,
                        (control: AbstractControl): ValidationErrors | null => {
                            const max: BigNumber = new BigNumber(intToMoney(maximum_value, zanoAssetInfo.decimal_point));
                            const amount: BigNumber = new BigNumber(control.value);
                            return amount.isGreaterThan(max) ? { greater_than_max_amount: { max: max.toString() } } : null;
                        },
                        ({ value }: FormControl): ValidationErrors | null => {
                            if (new BigNumber(value).isLessThan(default_fee)) {
                                return { less_min: true };
                            }
                            return null;
                        },
                    ],
                }),
                hide: this._fb.control<boolean>({
                    value: params.hide,
                    disabled: currentWallet.is_auditable && !currentWallet.is_watch_only,
                }),
            },
            {
                validators: [
                    (form: FormGroup): ValidationErrors | null => {
                        const asset_id = form.controls.asset_id.value;
                        const amount: BigNumber = new BigNumber(form.controls.amount.value);

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

                        const maximum_amount_by_decimal_point = intToMoney(this.variablesService.maximum_value, decimal_point);
                        if (amount.isGreaterThan(maximum_amount_by_decimal_point)) {
                            return { greater_than_maximum_amount: { max: maximum_amount_by_decimal_point } };
                        }

                        const preparedUnlocked = intToMoney(unlocked, decimal_point);
                        return amount.isGreaterThan(preparedUnlocked) ? { insuficcientFunds } : null;
                    },
                ],
            }
        );

        this._listenSendActionData();

        this._saveSendMoneyParams();

        this._formListeners();

        if (currentWallet.sendMoneyParams) {
            this.form.markAllAsTouched();
            this.form.updateValueAndValidity();
            this._updateErrorMessages();
        }
    }

    private _formListeners(): void {
        const { currentWallet } = this.variablesService;
        const {
            controls: { asset_id, address, fee },
        } = this.form;

        this.decimal_point$ = asset_id.valueChanges.pipe(
            startWith(asset_id.value),
            map((value: string): number => {
                return currentWallet.getBalanceByAssetId(value)?.asset_info.decimal_point ?? 0;
            })
        );

        merge(address.statusChanges, address.valueChanges)
            .pipe(takeUntil(this._destroy$))
            .subscribe((): void => this.updateAddressErrorMessage());

        merge(fee.statusChanges, fee.valueChanges)
            .pipe(takeUntil(this._destroy$))
            .subscribe((): void => this.updateFeeErrorMessage());

        this.addressItems$ = address.valueChanges.pipe(
            startWith(address.value),
            tap(value => {
                const condition = value[0] === '@';
                this.lowerCaseDisabled$.next(!condition);
                this.loadingAddressItems$.next(condition);
            }),
            debounceTime(250),
            map(value => {
                if (!value?.length) {
                    return this._openedWalletItems;
                }
                if (value[0] === '@') {
                    return this._aliasItems.filter(name => {
                        return name.includes(value);
                    });
                }
                return [];
            }),
            tap(() => this.loadingAddressItems$.next(false))
        );
    }

    private _updateErrorMessages(): void {
        this.updateAddressErrorMessage();
        this.updateFeeErrorMessage();
    }

    private _saveSendMoneyParams(): void {
        const { valueChanges } = this.form;
        const { currentWallet } = this.variablesService;
        valueChanges.pipe(debounceTime(200), takeUntil(this._destroy$)).subscribe({
            next: (): void => {
                currentWallet.sendMoneyParams = this.form.getRawValue();
            },
        });
    }

    private _getWrapInfo(): void {
        this.wrapInfoService
            .getWrapInfo()
            .pipe(
                tap(() => this.loadingWrapInfo$.next(true)),
                retry(5),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (wrapInfo: WrapInfo) => {
                    this.wrapInfo = wrapInfo;
                    this.loadingWrapInfo$.next(false);
                },
                error: () => {
                    this.loadingWrapInfo$.next(false);
                },
                complete: () => {
                    this.loadingWrapInfo$.next(false);
                },
            });
    }

    private _listenSendActionData(): void {
        this.variablesService.sendActionData$.pipe(takeUntil(this._destroy$)).subscribe({
            next: (value: DeeplinkParams) => {
                if (value && value.action === 'send') {
                    const { address, amount, comment, comments, mixins, fee, hide_sender } = value;
                    this.isVisibleAdditionalOptionsState = true;
                    this.form.patchValue({
                        address,
                        amount: amount || null,
                        comment: comment || comments || '',
                        mixin: +mixins || MIXIN,
                        asset_id: zanoAssetInfo.asset_id,
                        fee: fee || this.variablesService.default_fee,
                        hide: hide_sender === 'true',
                    });
                    this.variablesService.sendActionData$.next({});
                }
            },
        });
    }
}
