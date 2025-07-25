import { Component, inject, NgZone, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { debounceTime, filter, retry, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { AssetBalance, PriceInfo } from '@api/models/assets.model';
import { REG_EXP_ALIAS_NAME, validateWrapInfo, ZanoValidators } from '@parts/utils/zano-validators';
import { TransferDestinationsFormValue, TransferFormValue, TransferParams } from '@api/models/transfer.model';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { ApiService } from '@api/services/api.service';
import { BigNumber } from 'bignumber.js';
import { intToMoney } from '@parts/functions/int-to-money';
import { insufficientFunds } from '@parts/utils/zano-errors';
import { MAXIMUM_VALUE } from '@parts/data/constants';
import { moneyToInt } from '@parts/functions/money-to-int';
import { DeeplinkParams } from '@api/models/wallet.model';

const DEFAULT_SEND_MONEY_PARAMS: Omit<TransferFormValue, 'wallet_id'> = {
    asset_id: ZANO_ASSET_INFO.asset_id,
    destinations: [
        {
            address: '',
            amount: '',
            is_currency_input_mode: false,
            asset_id: ZANO_ASSET_INFO.asset_id,
            is_visible_wrap_info: false,
            alias_address: '',
        },
    ],
    comment: '',
    mixin: 0,
    fee: '0.01',
    lock_time: 0,
    push_payer: true,
    hide_receiver: false,
};

const DEFAULT_PRICE_INFO: PriceInfo = {
    success: false,
    data: 'Asset not found',
};

export type DestinationsForm = FormGroup<{
    address: FormControl<string>;
    amount: FormControl<string>;
    is_currency_input_mode: FormControl<boolean>;
    asset_id: FormControl<string>;
    is_visible_wrap_info: FormControl<boolean>;
    alias_address: FormControl<string>;
}>;

export type TransferForm = FormGroup<{
    wallet_id: FormControl<number>;
    destinations: FormArray<DestinationsForm>;
    comment: FormControl<string>;
    asset_id: FormControl<string>;
    mixin: FormControl<number>;
    lock_time: FormControl<number>;
    fee: FormControl<string>;
    push_payer: FormControl<boolean>;
    hide_receiver: FormControl<boolean>;
}>;

@Component({
    selector: 'app-send',
    templateUrl: 'send.component.html',
    styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnDestroy {
    private readonly _backend_service: BackendService = inject(BackendService);

    private readonly _ng_zone: NgZone = inject(NgZone);

    private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    private readonly _api_service: ApiService = inject(ApiService);

    readonly variables_service: VariablesService = inject(VariablesService);

    job_id: number;

    is_send_modal_state = false;

    is_send_details_modal_state = false;

    is_visible_additional_options_state = false;

    form: TransferForm;

    total_destinations_amount_and_fee = new BigNumber(0);

    price_info: PriceInfo = DEFAULT_PRICE_INFO;

    readonly price_info$: BehaviorSubject<PriceInfo> = new BehaviorSubject<PriceInfo>(DEFAULT_PRICE_INFO);

    private readonly _destroy$: Subject<void> = new Subject<void>();

    constructor() {
        this._createForm();
    }

    get is_visible_wrap_info(): boolean {
        const formValue = this.form?.getRawValue();
        if (!formValue) {
            return false;
        }
        const { destinations } = formValue;
        return isVisibleWrapInfoByDestinations(destinations);
    }

    get is_submit_disabled(): boolean {
        if (!this.form) {
            return true;
        }

        const {
            current_wallet: { loaded: is_current_wallet_loaded },
            is_wrap_info_service_inactive$: { value: is_wrap_info_service_inactive },
        } = this.variables_service;

        const { destinations } = this.form.getRawValue();

        const condition1: boolean = this.form?.invalid ?? true;
        const condition2 = !is_current_wallet_loaded;
        const condition3: boolean =
            destinations.map(({ is_visible_wrap_info }) => is_visible_wrap_info).some(Boolean) && is_wrap_info_service_inactive;

        return condition1 || condition2 || condition3;
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private _subscribeToIsWrapInfoServiceInactive(): void {
        this.variables_service.is_wrap_info_service_inactive$.pipe(takeUntil(this._destroy$)).subscribe({
            next: () => {
                this.form.controls.destinations.updateValueAndValidity();
            },
        });
    }

    beforeSubmit(): void {
        this.is_send_modal_state = true;
    }

    submit(): void {
        this._backend_service.sendMoney(this.getTransferParams(), (job_id: number) => {
            this._ng_zone.run(() => {
                this.job_id = job_id;
                this.is_send_details_modal_state = true;
                this.variables_service.current_wallet.transfer_form_value = null;
            });
        });
    }

    private convertToCurrencyAmount(amount: any, asset: AssetBalance): string {
        const price_info = this.price_info;
        const {
            settings: { currency },
        } = this.variables_service;
        const currency_price = typeof price_info.data === 'object' ? price_info.data.fiat_prices[currency] ?? 0 : 0;

        const decimal_point = asset?.asset_info?.decimal_point || 0;
        return new BigNumber(amount || 0)
            .dividedBy(currency_price || 1)
            .decimalPlaces(decimal_point)
            .toString();
    }

    getTransferParams(): TransferParams {
        const transfer_form_value: TransferFormValue = this.form.getRawValue();
        const { asset_id } = transfer_form_value;
        const { current_wallet } = this.variables_service;

        const asset = current_wallet.getBalanceByAssetId(asset_id);

        return {
            wallet_id: transfer_form_value.wallet_id,
            destinations: transfer_form_value.destinations.map((v) => ({
                ...prepareTransferDestinationsFormValueToTransferDestination(v),
                amount: v.is_currency_input_mode ? this.convertToCurrencyAmount(v.amount, asset) : v.amount,
            })),
            mixin: transfer_form_value.mixin,
            lock_time: transfer_form_value.lock_time,
            fee: moneyToInt(transfer_form_value.fee, ZANO_ASSET_INFO.decimal_point).toString(),
            comment: transfer_form_value.comment,
            // TODO: Do not delete, may return later
            // push_payer: transfer_form_value.push_payer,
            // TODO: Do not delete, may return later
            // hide_receiver: !transfer_form_value.hide_receiver,
        };
    }

    handleConfirmed(confirmed: boolean): void {
        this.is_send_modal_state = false;

        if (confirmed) {
            this.submit();
        }
    }

    handeCloseSendDetailsModal(success: boolean): void {
        this.is_send_details_modal_state = false;
        this.job_id = null;

        if (success) {
            const { current_wallet } = this.variables_service;
            const { wallet_id } = current_wallet;
            current_wallet.transfer_form_value = null;

            this.form.reset({ ...DEFAULT_SEND_MONEY_PARAMS, wallet_id });
        }
    }

    addDestination(): void {
        const {
            controls: { asset_id, destinations },
        } = this.form;
        destinations.push(this._createDestinationFromGroup(asset_id));
    }

    removeDestination(event: Event, index: number): void {
        event.preventDefault();
        event.stopPropagation();
        const {
            controls: { destinations },
        } = this.form;
        destinations.removeAt(index);
    }

    private _createForm(): void {
        const { current_wallet, default_fee, maxCommentLength } = this.variables_service;
        let init_transfer_form_value: TransferFormValue;

        if (current_wallet.transfer_form_value) {
            init_transfer_form_value = current_wallet.transfer_form_value;
        } else {
            init_transfer_form_value = {
                ...DEFAULT_SEND_MONEY_PARAMS,
                wallet_id: current_wallet.wallet_id,
                fee: default_fee,
            };
        }

        if (current_wallet.is_auditable && !current_wallet.is_watch_only) {
            init_transfer_form_value.hide_receiver = true;
        }

        if (current_wallet.is_auditable) {
            init_transfer_form_value.mixin = 0;
        }

        const history_state = history.state || {};
        const history_asset: AssetBalance = history_state['asset'];

        if (history_asset) {
            const {
                asset_info: { asset_id, decimal_point },
            } = history_asset;
            init_transfer_form_value.asset_id = asset_id;
            init_transfer_form_value.destinations.forEach((destination) => {
                destination.asset_id = asset_id;
                if (destination.amount) {
                    destination.amount = intToMoney(moneyToInt(destination.amount, decimal_point), decimal_point);
                }
            });
        }

        const wallet_id_control = this._fb.control<number>(
            { value: current_wallet.wallet_id, disabled: false },
            {
                validators: Validators.compose([Validators.required]),
            }
        );

        const asset_id_control = this._fb.control<string>(
            { value: init_transfer_form_value.asset_id, disabled: false },
            {
                validators: Validators.compose([Validators.required]),
            }
        );

        const destinations_control = this._fb.array<DestinationsForm>([]);
        if (init_transfer_form_value.destinations.length) {
            init_transfer_form_value.destinations.forEach(() => {
                destinations_control.push(this._createDestinationFromGroup(asset_id_control));
            });
        } else {
            destinations_control.push(this._createDestinationFromGroup(asset_id_control));
        }
        const comment_control = this._fb.control<string>(
            { value: '', disabled: false },
            {
                validators: Validators.compose([Validators.maxLength(maxCommentLength)]),
            }
        );

        const mixin_control = this._fb.control<number>(
            { value: 0, disabled: current_wallet.is_auditable },
            {
                validators: Validators.compose([Validators.required, Validators.min(0), Validators.max(1000)]),
            }
        );

        const lock_time_control = this._fb.control<number>({ value: 0, disabled: false });

        const fee_control = this._fb.control<string>(
            { value: default_fee, disabled: false },
            {
                validators: Validators.compose([
                    Validators.required,
                    ZanoValidators.greaterMax(MAXIMUM_VALUE, ZANO_ASSET_INFO.decimal_point),
                    ZanoValidators.lessMin(default_fee),
                ]),
            }
        );

        const push_payer_control = this._fb.control<boolean>({ value: false, disabled: false });

        const hide_receiver_control = this._fb.control<boolean>({
            value: false,
            disabled: current_wallet.is_auditable && !current_wallet.is_watch_only,
        });

        this.form = this._fb.group({
            wallet_id: wallet_id_control,
            destinations: destinations_control,
            comment: comment_control,
            asset_id: asset_id_control,
            mixin: mixin_control,
            lock_time: lock_time_control,
            fee: fee_control,
            push_payer: push_payer_control,
            hide_receiver: hide_receiver_control,
        });

        this.form.patchValue(init_transfer_form_value);

        this._listenSendActionData();

        this._saveSendMoneyParams();

        this._formListeners();

        if (current_wallet.transfer_form_value) {
            this.form.markAllAsTouched();
            this.form.updateValueAndValidity();
        }

        this._subscribeToIsWrapInfoServiceInactive();
    }

    private _validateAddress(control: AbstractControl): ValidationErrors | null {
        const { value: address, parent } = control;
        const is_visible_wrap_info_control = parent?.get('is_visible_wrap_info');

        this._backend_service.validateAddress(address, (status: boolean, data: any): void => {
            this._ng_zone.run(() => {
                const is_visible_wrap_info = data.error_code === 'WRAP';
                is_visible_wrap_info_control?.patchValue(is_visible_wrap_info);

                if (is_visible_wrap_info) {
                    const { asset_id } = ZANO_ASSET_INFO;
                    this.form.controls.asset_id.patchValue(asset_id);
                }

                if (!status && !is_visible_wrap_info) {
                    this._setError(control, 'address_not_valid');
                } else {
                    this._clearError(control, 'address_not_valid');
                }
            });
        });

        return control.hasError('address_not_valid') ? { address_not_valid: true } : null;
    }

    private _validateAlias(control: AbstractControl): ValidationErrors | null {
        if (!REG_EXP_ALIAS_NAME.test(control.value)) {
            return { alias_not_valid: true };
        }

        const name: string = control.value.replace('@', '');

        const { parent } = control;
        const alias_address_control = parent?.get('alias_address');

        this._backend_service.getAliasInfoByName(name, (status: boolean, data: any) => {
            this._ng_zone.run(() => {
                alias_address_control?.patchValue(data.address);

                if (status) {
                    this._clearError(control, 'alias_not_found');
                } else {
                    this._setError(control, 'alias_not_found');
                }
            });
        });

        return control.hasError('alias_not_found') ? { alias_not_found: true } : null;
    }

    private _setError(control: AbstractControl, errorKey: string): void {
        const errors = { ...control.errors, [errorKey]: true };
        control.setErrors(errors);
    }

    private _clearError(control: AbstractControl, errorKey: string): void {
        if (control.hasError(errorKey)) {
            const errors = { ...control.errors };
            delete errors[errorKey];
            control.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
    }

    private _validateAddressOrAlias(control: AbstractControl): ValidationErrors | null {
        const { parent } = control;
        const is_visible_wrap_info_control = parent?.get('is_visible_wrap_info');
        const alias_address_control = parent?.get('alias_address');

        alias_address_control?.patchValue('');
        is_visible_wrap_info_control?.patchValue(false);

        const { value } = control;

        if (!value) {
            return null;
        }

        if (value.startsWith('@')) {
            return this._validateAlias(control);
        } else {
            return this._validateAddress(control);
        }
    }

    private _formListeners(): void {
        this._subscribeToAssetIdChanges();
        this._subscribeToFormChanges();
        this._subscribeToDescriptionsChanges();
    }

    private _subscribeToDescriptionsChanges(): void {
        this.form.controls.destinations.valueChanges
            .pipe(startWith(this.form.controls.destinations.value), takeUntil(this._destroy$))
            .subscribe({
                next: (destinations) => {
                    if (destinations.length > 1) {
                        this.form.controls.comment.reset('');
                        this.form.controls.comment.disable();
                    } else {
                        this.form.controls.comment.enable();
                    }
                },
            });
    }

    private _subscribeToFormChanges(): void {
        this.form.valueChanges.pipe(takeUntil(this._destroy$)).subscribe({
            next: () => {
                let total_destinations_amount_and_fee = new BigNumber(0);

                const { current_wallet } = this.variables_service;

                this.form.controls.destinations.controls.forEach((control) => {
                    const asset = current_wallet.getBalanceByAssetId(control.controls.asset_id.value);

                    const amount = control.controls.is_currency_input_mode.value
                        ? this.convertToCurrencyAmount(control.controls.amount.value, asset)
                        : new BigNumber(control.controls.amount.value);
                    total_destinations_amount_and_fee = total_destinations_amount_and_fee.plus(new BigNumber(amount || 0));
                });

                total_destinations_amount_and_fee = total_destinations_amount_and_fee.plus(
                    new BigNumber(this.form.controls.fee.value || 0)
                );

                this.total_destinations_amount_and_fee = total_destinations_amount_and_fee;

                this.form.controls.destinations.controls.forEach((control) => {
                    control.updateValueAndValidity({ emitEvent: false });
                });
            },
        });
    }

    private _subscribeToAssetIdChanges(): void {
        this.form.controls.asset_id.valueChanges
            .pipe(
                startWith(this.form.controls.asset_id.value),
                switchMap((assetId) => this._api_service.getCurrentPriceForAsset(assetId).pipe(retry(2))),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (priceInfo: PriceInfo) => {
                    this.price_info = priceInfo;
                    this.price_info$.next(priceInfo);
                },
            });
    }

    private _saveSendMoneyParams(): void {
        const { current_wallet } = this.variables_service;
        this.form.valueChanges.pipe(debounceTime(800), takeUntil(this._destroy$)).subscribe({
            next: (): void => {
                current_wallet.transfer_form_value = this.form.getRawValue();
            },
        });
    }

    private _listenSendActionData(): void {
        this.variables_service.sendActionData$
            .pipe(
                filter((value) => value?.action === 'send'),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (value: DeeplinkParams) => {
                    // https://docs.zano.org/docs/use/deeplinks/
                    const { address, amount, comment, comments, fee, hide_sender, hide_receiver } = value;
                    this.is_visible_additional_options_state = true;
                    this.form.patchValue({
                        destinations: [
                            {
                                address: address || '',
                                asset_id: ZANO_ASSET_INFO.asset_id,
                                amount: amount || '',
                            },
                        ],
                        comment: comment || comments || '',
                        asset_id: ZANO_ASSET_INFO.asset_id,
                        fee: fee || this.variables_service.default_fee,
                        push_payer: hide_sender === 'false',
                        hide_receiver: hide_receiver === 'false',
                    });
                    this.variables_service.sendActionData$.next({});
                },
            });
    }

    private _createDestinationFromGroup(asset_id_control: FormControl<string>): DestinationsForm {
        const address_control = this._fb.control<string>(
            { value: '', disabled: false },
            {
                validators: Validators.compose([Validators.required, this._validateAddressOrAlias.bind(this)]),
            }
        );

        const amount_control = this._fb.control<string>(
            { value: '', disabled: false },
            {
                validators: Validators.compose([Validators.required, ZanoValidators.zeroValue]),
            }
        );

        const is_currency_input_mode_control = this._fb.control<boolean>({ value: false, disabled: false });

        const alias_address_control = this._fb.control<string>({ value: '', disabled: false });

        const is_visible_wrap_info_control = this._fb.control<boolean>({ value: false, disabled: false });

        return this._fb.group(
            {
                address: address_control,
                amount: amount_control,
                is_currency_input_mode: is_currency_input_mode_control,
                alias_address: alias_address_control,
                is_visible_wrap_info: is_visible_wrap_info_control,
                asset_id: asset_id_control,
            },
            {
                validators: [
                    (form: FormGroup): ValidationErrors | null => {
                        const { asset_id, is_currency_input_mode, is_visible_wrap_info, amount } = form.getRawValue();
                        const errors: ValidationErrors = {};

                        const assetBalance: AssetBalance | undefined = this.variables_service.current_wallet.getBalanceByAssetId(asset_id);
                        const wrapInfo = this.variables_service.wrap_info$.value;
                        const {
                            settings: { currency },
                        } = this.variables_service;
                        const priceInfo = this.price_info;

                        const currency_price = typeof priceInfo.data === 'object' ? priceInfo.data.fiat_prices[currency] ?? 0 : 0;
                        const amountBigNumber = new BigNumber(
                            is_currency_input_mode ? new BigNumber(amount).dividedBy(currency_price) : amount
                        );

                        // 1. Balance not found
                        if (!assetBalance) {
                            return { asset_not_found: true };
                        }

                        const {
                            unlocked,
                            asset_info: { decimal_point },
                        } = assetBalance;

                        const maxAllowed = intToMoney(MAXIMUM_VALUE, decimal_point);
                        const preparedUnlocked = intToMoney(unlocked, decimal_point);

                        // 2. Greater than maxAllow
                        if (amountBigNumber.isGreaterThan(maxAllowed)) {
                            errors.greater_max = { max: maxAllowed };
                        }

                        // 3. Insufficient Funds
                        if (
                            this.total_destinations_amount_and_fee.isGreaterThan(preparedUnlocked) ||
                            amountBigNumber.isGreaterThan(preparedUnlocked)
                        ) {
                            errors.insufficientFunds = insufficientFunds;
                        }

                        // 4. Validate wrapInfo if needed
                        if (is_visible_wrap_info) {
                            if (!wrapInfo) {
                                errors.wrap_info_null = true;
                            } else if (!validateWrapInfo(wrapInfo)) {
                                errors.wrap_info_invalid = true;
                            } else {
                                const unwraped = intToMoney(new BigNumber(wrapInfo.unwraped_coins_left));
                                const needed = intToMoney(new BigNumber(wrapInfo.tx_cost.zano_needed_for_erc20));

                                if (amountBigNumber.isGreaterThan(unwraped)) {
                                    errors.great_than_unwraped_coins = true;
                                }

                                if (amountBigNumber.isLessThan(needed)) {
                                    errors.less_than_zano_needed = true;
                                }
                            }
                        }

                        return Object.keys(errors).length > 0 ? errors : null;
                    },
                ],
            }
        );
    }
}

const isVisibleWrapInfoByDestinations = (destinations: TransferDestinationsFormValue[]): boolean =>
    destinations.map(({ is_visible_wrap_info }: TransferDestinationsFormValue) => is_visible_wrap_info).some(Boolean);

const prepareTransferDestinationsFormValueToTransferDestination = ({
    address,
    amount,
    alias_address,
    asset_id,
}: TransferDestinationsFormValue): { address: string; asset_id: string; amount: any } => ({
    address: address.startsWith('@') ? alias_address : address,
    asset_id,
    amount,
});
