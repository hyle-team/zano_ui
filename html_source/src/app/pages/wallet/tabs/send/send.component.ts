import { Component, inject, NgZone, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { BigNumber } from 'bignumber.js';
import { MIXIN } from '@parts/data/constants';
import { catchError, debounceTime, distinctUntilChanged, map, retry, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { AssetBalance, PriceInfo } from '@api/models/assets.model';
import { regExpAliasName } from '@parts/utils/zano-validators';
import { insuficcientFunds } from '@parts/utils/zano-errors';
import { DeeplinkParams, defaultSendMoneyParams } from '@api/models/wallet.model';
import { WrapInfo } from '@api/models/wrap-info';
import { WrapInfoService } from '@api/services/wrap-info.service';
import { SendMoneyFormParams } from '@api/models/send-money.model';
import { defaultImgSrc, ZanoAssetInfo, zanoAssetInfo } from '@parts/data/assets';
import { moneyToInt } from '@parts/functions/money-to-int';
import { intToMoney } from '@parts/functions/int-to-money';
import { TranslateService } from '@ngx-translate/core';
import { WalletsService } from '@parts/services/wallets.service';
import { HttpClient } from '@angular/common/http';

interface AmountInputParams {
    decimalPoint: number;
    inputTicker: string;
    hintTicker: string;
    hintAmount: string;
    reverseDisabled: boolean;
}

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
export class SendComponent implements OnDestroy {
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
        isAmountUSD: FormControl<boolean>;
        comment: FormControl<string>;
        asset_id: FormControl<string>;
        mixin: FormControl<number>;
        fee: FormControl<string>;
        push_payer: FormControl<boolean>;
        hide_receiver: FormControl<boolean>;
    }>;

    addressItems$: Observable<string[]>;

    loadingAddressItems$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    amountInputParams: AmountInputParams = {
        decimalPoint: 0,
        inputTicker: '',
        hintTicker: '',
        hintAmount: '',
        reverseDisabled: false,
    };

    errorMessages: { [key: string]: string | undefined } = {
        address: undefined,
        fee: undefined,
        amount: undefined,
    };
    public readonly zanoAssetInfo: ZanoAssetInfo = zanoAssetInfo;
    public priceInfo: PriceInfo = { success: false, data: 'Asset not found' };
    private _priceInfo$: Subject<PriceInfo> = new Subject();
    private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
    private _httpClient: HttpClient = inject(HttpClient);
    private _destroy$: Subject<void> = new Subject<void>();
    private _backendService: BackendService = inject(BackendService);
    private _ngZone: NgZone = inject(NgZone);
    private _translateService: TranslateService = inject(TranslateService);
    private _walletsService: WalletsService = inject(WalletsService);
    private _openedWalletItems: string[] = this._walletsService.wallets.map(({ address, alias }) => alias?.name ?? address);
    private _aliasItems: string[] = this.variablesService.aliases.map(({ name }) => name);

    constructor() {
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

    updateAmountErrorMessage(): void {
        const {
            controls: { amount },
        } = this.form;
        let message: string | undefined;

        switch (true) {
            case amount.hasError('zero'): {
                message = 'SEND.FORM_ERRORS.AMOUNT_ZERO';
                break;
            }
            case amount.hasError('great_than_unwraped_coins'): {
                message = 'SEND.FORM_ERRORS.GREAT_THAN_UNWRAPPED_COINS';
                break;
            }
            case amount.hasError('less_than_zano_needed'): {
                message = 'SEND.FORM_ERRORS.LESS_THAN_ZANO_NEEDED';
                break;
            }
            case amount.hasError('wrap_info_null'): {
                message = 'SEND.FORM_ERRORS.WRAP_INFO_NULL';
                break;
            }
            case amount.hasError('required'): {
                message = 'ERRORS.REQUIRED';
                break;
            }
            case this.form.hasError('insuficcientFunds'): {
                message = this.form.errors['insuficcientFunds'].errorText;
                break;
            }
            case this.form.hasError('greater_than_maximum_amount'): {
                message = this._translateService.instant('ERRORS.MAX', { max: this.form.errors['greater_than_maximum_amount'].max });
                break;
            }
            case this.form.hasError('asset_not_found'): {
                message = 'ERRORS.ASSET_NOT_FOUND';
                break;
            }
        }

        this.errorMessages['amount'] = message;
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
                break;
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

    isVisibleError(control: AbstractControl): boolean {
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
        let sendMoneyParams = this.form.getRawValue();

        const { address, asset_id, isAmountUSD, hide_receiver } = sendMoneyParams;
        let { amount } = sendMoneyParams;

        const { currentWallet } = this.variablesService;
        const asset: AssetBalance | undefined = currentWallet.getBalanceByAssetId(asset_id);

        if (asset) {
            const convertedAmountUSD = (): string => {
                let usd = 0;

                if (typeof this.priceInfo.data === 'object') {
                    const { data } = this.priceInfo;
                    usd = data.usd;
                }

                let decimal_point = 0;

                if (asset) {
                    const { asset_info } = asset;
                    decimal_point = asset_info.decimal_point;
                }

                const convertedAmount = new BigNumber(amount || 0).dividedBy(usd || 0).decimalPlaces(decimal_point);

                return convertedAmount.toString();
            };

            amount = isAmountUSD ? convertedAmountUSD() : amount;

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

        // Remove unused param
        delete sendMoneyParams.isAmountUSD;

        sendMoneyParams = {
            ...sendMoneyParams,
            // Need to send "true" if the value is "false" and "false" if the value is "true"
            hide_receiver: !hide_receiver
        };

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
                isAmountUSD: { value: isAmountUSD },
                asset_id: { value: asset_id },
            },
        } = this.form;

        const convertedAmountUSD = (): string => {
            let usd = 0;

            if (typeof this.priceInfo.data === 'object') {
                const { data } = this.priceInfo;
                usd = data.usd;
            }

            let decimal_point = 0;
            const { currentWallet } = this.variablesService;
            const asset: AssetBalance | undefined = currentWallet.getBalanceByAssetId(asset_id);

            if (asset) {
                const { asset_info } = asset;
                decimal_point = asset_info.decimal_point;
            }

            const convertedAmount = new BigNumber(amount || 0).dividedBy(usd || 0).decimalPlaces(decimal_point);

            return convertedAmount.toString();
        };
        const preparedAmount: BigNumber = moneyToInt(isAmountUSD ? convertedAmountUSD() : amount || '0');

        const {
            tx_cost: { zano_needed_for_erc20 },
        } = this.wrapInfo;
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

    toggleAmountUSD(): void {
        const { isAmountUSD } = this.form.getRawValue();
        this.form.controls.isAmountUSD.patchValue(!isAmountUSD);
    }

    private _createForm(): void {
        const { currentWallet, default_fee, maxCommentLength, maximum_value } = this.variablesService;

        let params: SendMoneyFormParams;

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
            params.hide_receiver = true;
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
                            this.isVisibleWrapInfoState$.next(false);
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

                            return null;
                        },
                    ],
                }),
                isAmountUSD: this._fb.control<boolean>(params.isAmountUSD),
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
                push_payer: this._fb.control(params.push_payer),
                hide_receiver: this._fb.control<boolean>({
                    value: params.hide_receiver,
                    disabled: currentWallet.is_auditable && !currentWallet.is_watch_only,
                }),
            },
            {
                validators: [
                    (form: FormGroup): ValidationErrors | null => {
                        const asset_id = form.controls.asset_id.value;
                        const isAmountUSD = form.controls.isAmountUSD.value;

                        const convertedAmountUSD = (): BigNumber => {
                            let usd = 0;
                            if (typeof this.priceInfo.data === 'object') {
                                const { data } = this.priceInfo;
                                usd = data.usd;
                            }
                            return new BigNumber(form.controls.amount.value).dividedBy(usd);
                        };

                        const amount: BigNumber = isAmountUSD ? convertedAmountUSD() : new BigNumber(form.controls.amount.value);

                        const assetBalance: AssetBalance | undefined = currentWallet.getBalanceByAssetId(asset_id);

                        if (this.isVisibleWrapInfoState$.value) {
                            let error = null;

                            if (!this.wrapInfo) {
                                error = { wrap_info_null: true };
                            }

                            if (amount.isGreaterThan(intToMoney(new BigNumber(this.wrapInfo.unwraped_coins_left)))) {
                                error = { great_than_unwraped_coins: true };
                            }

                            if (amount.isLessThan(intToMoney(new BigNumber(this.wrapInfo.tx_cost.zano_needed_for_erc20)))) {
                                error = { less_than_zano_needed: true };
                            }

                            if (error) {
                                form.controls.amount.setErrors(error);
                            }
                        }

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
        const { controls } = this.form;

        combineLatest([
            controls.asset_id.valueChanges.pipe(startWith(controls.asset_id.value)),
            controls.isAmountUSD.valueChanges.pipe(startWith(controls.isAmountUSD.value), distinctUntilChanged()),
            controls.amount.valueChanges.pipe(startWith(controls.amount.value)),
            this._priceInfo$,
        ])
            .pipe(
                map(([asset_id, isAmountUSD, amount, priceInfo]) => {
                    const { decimal_point, ticker } = currentWallet.getBalanceByAssetId(asset_id)?.asset_info ?? {};

                    const params: AmountInputParams = {
                        decimalPoint: decimal_point,
                        inputTicker: ticker,
                        hintTicker: 'USD',
                        hintAmount: '0',
                        reverseDisabled: false,
                    };

                    const { success } = priceInfo;

                    if (success) {
                        const { data } = priceInfo;

                        let usd = 0;

                        if (typeof data === 'object') {
                            usd = data.usd;
                        }

                        if (isAmountUSD) {
                            params.decimalPoint = 2;
                            params.inputTicker = 'USD';
                            params.hintTicker = ticker;
                            params.hintAmount = `~ ${new BigNumber(+amount ?? 0).dividedBy(usd ?? 0).decimalPlaces(decimal_point)}`;
                        } else {
                            params.decimalPoint = decimal_point;
                            params.inputTicker = ticker;
                            params.hintTicker = 'USD';
                            params.hintAmount = `~ ${new BigNumber(usd ?? 0).multipliedBy(+amount ?? 0).decimalPlaces(2)}`;
                        }
                    } else {
                        params.reverseDisabled = true;
                        controls.isAmountUSD.patchValue(false);
                    }

                    return params;
                })
            )
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: params => {
                    this.amountInputParams = params;
                },
            });

        controls.asset_id.valueChanges
            .pipe(
                startWith(controls.asset_id.value),
                switchMap(asset_id => {
                    const default$ = of({
                        success: false,
                        data: 'Asset not found',
                    });
                    const price$ = this._httpClient.get<PriceInfo>(`https://explorer.zano.org/api/price?asset_id=${asset_id}`).pipe(
                        retry(5),
                        catchError((err: Error) => {
                            return default$;
                        })
                    );
                    return zanoAssetInfo.asset_id === asset_id ? price$ : default$;
                }),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (value: PriceInfo) => {
                    this.priceInfo = value;
                    this._priceInfo$.next(value);

                    this.form.controls.amount.updateValueAndValidity({ emitEvent: false });
                },
            });

        merge(controls.address.statusChanges, controls.address.valueChanges)
            .pipe(takeUntil(this._destroy$))
            .subscribe((): void => this.updateAddressErrorMessage());

        merge(controls.amount.statusChanges, controls.amount.valueChanges, this.form.statusChanges, this.form.valueChanges)
            .pipe(takeUntil(this._destroy$))
            .subscribe((): void => this.updateAmountErrorMessage());

        merge(controls.fee.statusChanges, controls.fee.valueChanges)
            .pipe(takeUntil(this._destroy$))
            .subscribe((): void => this.updateFeeErrorMessage());

        this.addressItems$ = controls.address.valueChanges.pipe(
            startWith(controls.address.value),
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
        this.updateAmountErrorMessage();
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
                    const { address, amount, comment, comments, mixins, fee, hide_sender, hide_receiver } = value;
                    this.isVisibleAdditionalOptionsState = true;
                    this.form.patchValue({
                        address,
                        amount: amount || null,
                        comment: comment || comments || '',
                        mixin: +mixins || MIXIN,
                        asset_id: zanoAssetInfo.asset_id,
                        fee: fee || this.variablesService.default_fee,
                        push_payer: hide_sender === 'false',
                        hide_receiver: hide_receiver === 'false',
                    });
                    this.variablesService.sendActionData$.next({});
                }
            },
        });
    }
}
