import { Component, inject, NgZone, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { AssetBalance } from '@api/models/assets.model';
import { createAddressAliasValidator, debouncedAsyncValidator, validateWrapInfo, ZanoValidators } from '@parts/utils/zano-validators';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { BigNumber } from 'bignumber.js';
import { intToMoney } from '@parts/functions/int-to-money';
import { insufficientFunds } from '@parts/utils/zano-errors';
import {
    ALIAS_PREFIX,
    DEFAULT_FEE,
    LEGACY_PREFIX,
    MAX_COMMENT_LENGTH,
    MAX_DESTINATIONS_LENGTH,
    MAXIMUM_VALUE,
} from '@parts/data/constants';
import { moneyToInt } from '@parts/functions/money-to-int';
import { SendDeeplink } from '@api/models/wallet.model';

export interface TransferDestinationsFormValue {
    address: string;
    amount: string;
    is_currency_input_mode: boolean;
    asset_id: string;
    is_visible_wrap_info: boolean;
    alias_address: string;
}

export interface TransferFormValue {
    destinations: TransferDestinationsFormValue[];
    comment: string;
    fee: string;
}

const DEFAULT_TRANSFER_FORM_VALUE: TransferFormValue = {
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
    fee: DEFAULT_FEE,
};

export type DestinationFormGroup = FormGroup<{
    address: FormControl<string>;
    amount: FormControl<string>;
    is_currency_input_mode: FormControl<boolean>;
    asset_id: FormControl<string>;
    is_visible_wrap_info: FormControl<boolean>;
    alias_address: FormControl<string>;
}>;

export type TransferFormGroup = FormGroup<{
    destinations: FormArray<DestinationFormGroup>;
    comment: FormControl<string>;
    fee: FormControl<string>;
}>;

const feeValidator = Validators.compose([
    Validators.required,
    ZanoValidators.greaterMax(MAXIMUM_VALUE, ZANO_ASSET_INFO.decimal_point),
    ZanoValidators.lessMin(DEFAULT_FEE),
]);

const commentValidator = Validators.compose([Validators.maxLength(MAX_COMMENT_LENGTH)]);

@Component({
    selector: 'app-send',
    templateUrl: 'send.component.html',
    styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnDestroy {
    private readonly _backend_service: BackendService = inject(BackendService);

    private readonly _ng_zone: NgZone = inject(NgZone);

    private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    readonly variables_service: VariablesService = inject(VariablesService);

    job_id: number;

    is_send_modal_state = false;

    is_send_details_modal_state = false;

    is_show_additional_details = false;

    form: TransferFormGroup;

    canAddOrDuplicate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    private readonly _destroy$: Subject<void> = new Subject<void>();

    constructor() {
        this._createForm();
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

        const condition1: boolean = (this.form?.invalid || this.form?.pending) ?? true;
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

    private convertToCurrencyAmount(amount: any, assetBalance: AssetBalance): string {
        if (!assetBalance) {
            return '0';
        }

        const {
            settings: { currency },
            currentPriceForAssets,
        } = this.variables_service;
        const price_info = currentPriceForAssets[assetBalance.asset_info.asset_id];

        const currency_price = typeof price_info.data === 'object' ? price_info.data.fiat_prices[currency] ?? 0 : 0;

        const decimal_point = assetBalance.asset_info.decimal_point || 0;
        return new BigNumber(amount || 0)
            .dividedBy(currency_price || 1)
            .decimalPlaces(decimal_point)
            .toString();
    }

    duplicateDestination(copyDestinationFormGroup: DestinationFormGroup): void {
        const destination = this._createDestinationFromGroup();
        destination.patchValue(copyDestinationFormGroup.getRawValue());

        destination.markAllAsTouched();
        destination.updateValueAndValidity();

        this.form.controls.destinations.push(destination);
    }

    getTransferParams() {
        const transfer_form_value: TransferFormValue = this.form.getRawValue();
        const {
            current_wallet: { wallet_id },
        } = this.variables_service;

        return {
            wallet_id,
            destinations: transfer_form_value.destinations.map((destination) => this._mapDestination(destination)),
            fee: moneyToInt(transfer_form_value.fee, ZANO_ASSET_INFO.decimal_point).toString(),
            comment: transfer_form_value.comment,
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
            current_wallet.transfer_form_value = null;

            const { destinations } = this.form.controls;
            destinations.clear();
            destinations.push(this._createDestinationFromGroup());

            this.form.reset(DEFAULT_TRANSFER_FORM_VALUE);
        }
    }

    addDestination(): void {
        this.form.controls.destinations.push(this._createDestinationFromGroup());
    }

    removeDestination(index: number): void {
        this.form.controls.destinations.removeAt(index);
    }

    private _createForm(): void {
        const { current_wallet } = this.variables_service;
        let init_transfer_form_value: TransferFormValue;

        if (current_wallet.transfer_form_value) {
            init_transfer_form_value = current_wallet.transfer_form_value;
        } else {
            init_transfer_form_value = DEFAULT_TRANSFER_FORM_VALUE;
        }

        const history_state = history.state || {};
        const history_asset: AssetBalance = history_state['asset'];

        if (history_asset) {
            const {
                asset_info: { asset_id, decimal_point },
            } = history_asset;

            init_transfer_form_value.destinations.forEach((destination) => {
                destination.asset_id = asset_id;
                if (destination.amount) {
                    destination.amount = intToMoney(moneyToInt(destination.amount, decimal_point), decimal_point);
                }
            });
        }

        const destinations_control = this._fb.array<DestinationFormGroup>([]);
        destinations_control.setValidators(this._maxDestinationsValidator.bind(this));
        if (init_transfer_form_value.destinations.length) {
            init_transfer_form_value.destinations.forEach(() => {
                destinations_control.push(this._createDestinationFromGroup());
            });
        } else {
            destinations_control.push(this._createDestinationFromGroup());
        }
        const comment_control = this._fb.control<string>('', commentValidator);

        const fee_control = this._fb.control<string>(DEFAULT_FEE, feeValidator);

        this.form = this._fb.group(
            {
                destinations: destinations_control,
                comment: comment_control,
                fee: fee_control,
            },
            {
                validators: [
                    (formGroup: TransferFormGroup) => {
                        const { fee, destinations } = formGroup.getRawValue();
                        const feeControl = formGroup.controls.fee;

                        const zanoBalance = this.variables_service.current_wallet.getBalanceByAssetId(ZANO_ASSET_INFO.asset_id);
                        if (!zanoBalance) {
                            return null;
                        }

                        const {
                            unlocked,
                            asset_info: { decimal_point },
                        } = zanoBalance;

                        const availableZanoBalance = new BigNumber(intToMoney(unlocked, decimal_point));
                        const feeValue = new BigNumber(fee ?? 0);

                        let totalZanoAmount = new BigNumber(0);
                        const { current_wallet } = this.variables_service;

                        destinations.forEach((destination) => {
                            if (destination.asset_id === ZANO_ASSET_INFO.asset_id) {
                                const asset = current_wallet.getBalanceByAssetId(destination.asset_id);
                                const amount = new BigNumber(
                                    destination.is_currency_input_mode
                                        ? this.convertToCurrencyAmount(destination.amount, asset)
                                        : destination.amount || 0
                                );
                                totalZanoAmount = totalZanoAmount.plus(amount);
                            }
                        });

                        const totalRequired = feeValue.plus(totalZanoAmount);
                        const hasInsufficientFunds = totalRequired.isGreaterThan(availableZanoBalance);

                        if (hasInsufficientFunds) {
                            feeControl.markAsTouched();
                            this._setError(feeControl, 'insufficientFundsForFee');
                            this.is_show_additional_details = true;
                        } else {
                            this._clearError(feeControl, 'insufficientFundsForFee');
                        }

                        return null;
                    },
                ],
            }
        );

        this.form.patchValue(init_transfer_form_value, { emitEvent: false });

        this._listenSendActionData();

        this._formListeners();

        if (current_wallet.transfer_form_value) {
            const destinationsFormArray = this.form.controls.destinations;
            current_wallet.transfer_form_value.destinations.forEach((savedDestination, index) => {
                const destinationGroup = destinationsFormArray.at(index);
                if (destinationGroup) {
                    Object.keys(savedDestination).forEach((key) => {
                        if (savedDestination[key] && destinationGroup.get(key)) {
                            destinationGroup.get(key).markAsTouched();
                        }
                    });
                }
            });
            this.form.updateValueAndValidity();
        }

        this._subscribeToIsWrapInfoServiceInactive();

        this._saveTransferParams();
    }

    private _maxDestinationsValidator(control: AbstractControl): ValidationErrors | null {
        if (!(control instanceof FormArray)) {
            return null;
        }
        const destinations = control.getRawValue() as TransferDestinationsFormValue[];
        const uniqueAssetIds = new Set<string>();

        destinations.forEach(({ asset_id }) => {
            if (asset_id && asset_id !== ZANO_ASSET_INFO.asset_id) {
                uniqueAssetIds.add(asset_id);
            }
        });

        const maxDestinations = MAX_DESTINATIONS_LENGTH - uniqueAssetIds.size;

        if (destinations.length > maxDestinations) {
            return { max_destinations: { max: maxDestinations, actual: destinations.length } };
        }

        return null;
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

    private _formListeners(): void {
        this._subscribeToDestinationsChanges();
    }

    private _subscribeToDestinationsChanges(): void {
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

                    const uniqueAssetIds = new Set<string>();
                    destinations.forEach(({ asset_id }) => {
                        if (asset_id && asset_id !== ZANO_ASSET_INFO.asset_id) {
                            uniqueAssetIds.add(asset_id);
                        }
                    });
                    const maxDestinations = MAX_DESTINATIONS_LENGTH - uniqueAssetIds.size;
                    this.canAddOrDuplicate$.next(destinations.length < maxDestinations);

                    this.form.controls.destinations.controls.forEach((group) => {
                        group.controls.amount.updateValueAndValidity({ emitEvent: false });
                    });
                },
            });
    }

    private _saveTransferParams(): void {
        const { current_wallet } = this.variables_service;
        this.form.valueChanges.pipe(takeUntil(this._destroy$)).subscribe({
            next: (): void => {
                current_wallet.transfer_form_value = this.form.getRawValue();
            },
        });
    }

    private _listenSendActionData(): void {
        this.variables_service.deeplinkData$
            .pipe(
                filter((params) => Boolean(params)),
                filter((value) => value.action === 'send'),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (value: SendDeeplink) => {
                    this.is_show_additional_details = true;

                    const { address = '', amount = '', comment = '', asset_id = ZANO_ASSET_INFO.asset_id } = value;

                    const destination = {
                        address,
                        asset_id,
                        amount,
                    };
                    const destinations = [destination];

                    this.form.patchValue({
                        destinations,
                        comment,
                        fee: DEFAULT_FEE,
                    });

                    // Clear send action data
                    this.variables_service.deeplinkData$.next({});
                },
            });
    }

    private _mapDestination({
        address,
        alias_address,
        asset_id,
        is_currency_input_mode,
        amount,
    }: TransferDestinationsFormValue): { address: string; asset_id: string; amount: string } {
        const finalAddress = address.startsWith(ALIAS_PREFIX) ? alias_address : address.replace(LEGACY_PREFIX, '');
        const finalAmount = is_currency_input_mode
            ? this.convertToCurrencyAmount(amount, this.variables_service.current_wallet.getBalanceByAssetId(asset_id))
            : amount;

        return {
            address: finalAddress,
            asset_id,
            amount: finalAmount,
        };
    }

    private _destinationGroupValidator(form: FormGroup): ValidationErrors | null {
        const { asset_id, is_currency_input_mode, is_visible_wrap_info, amount } = form.getRawValue();
        const errors: ValidationErrors = {};

        const assetBalance: AssetBalance | undefined = this.variables_service.current_wallet.getBalanceByAssetId(asset_id);
        const wrapInfo = this.variables_service.wrap_info$.value;
        const {
            settings: { currency },
            currentPriceForAssets,
        } = this.variables_service;
        const priceInfo = currentPriceForAssets[asset_id];

        const currency_price = typeof priceInfo?.data === 'object' ? priceInfo.data.fiat_prices[currency] ?? 0 : 0;
        const amountBigNumber = new BigNumber(
            is_currency_input_mode ? new BigNumber(amount).dividedBy(currency_price || 1) : amount
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
        const parentArray = form.parent as FormArray;
        if (parentArray) {
            let totalAmountForAsset = new BigNumber(0);
            for (const destinationControl of parentArray.controls) {
                const destinationValue = (destinationControl as FormGroup).getRawValue();
                if (destinationValue.asset_id === asset_id) {
                    const destAmount = destinationValue.amount;
                    const destIsCurrency = destinationValue.is_currency_input_mode;

                    const priceInfoForDest = currentPriceForAssets[destinationValue.asset_id];
                    const currencyPriceForDest =
                        typeof priceInfoForDest?.data === 'object' ? priceInfoForDest.data.fiat_prices[currency] ?? 0 : 0;

                    const destAmountInAsset = new BigNumber(
                        destIsCurrency ? new BigNumber(destAmount).dividedBy(currencyPriceForDest || 1) : destAmount
                    );
                    totalAmountForAsset = totalAmountForAsset.plus(destAmountInAsset);
                }
            }
            if (totalAmountForAsset.isGreaterThan(preparedUnlocked)) {
                errors.insufficientFunds = insufficientFunds;
            }
        } else if (amountBigNumber.isGreaterThan(preparedUnlocked)) {
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
    }

    private _createDestinationFromGroup(): DestinationFormGroup {
        const aliasAddressControl = this._fb.control<string>('');
        const isVisibleWrapInfoControl = this._fb.control<boolean>(false);

        const addressAliasValidator = debouncedAsyncValidator(
            createAddressAliasValidator(
                this._backend_service,
                this.variables_service,
                this._ng_zone,
                aliasAddressControl,
                isVisibleWrapInfoControl
            ),
            500
        );

        const addressControl = this._fb.control<string>('', {
            validators: [Validators.required],
            asyncValidators: [addressAliasValidator],
        });

        return this._fb.group(
            {
                address: addressControl,
                amount: this._fb.control<string>('', {
                    validators: [Validators.required, ZanoValidators.zeroValue],
                }),
                is_currency_input_mode: this._fb.control<boolean>(false),
                alias_address: aliasAddressControl,
                is_visible_wrap_info: isVisibleWrapInfoControl,
                asset_id: this._fb.control<string>('', [Validators.required]),
            },
            {
                validators: [this._destinationGroupValidator.bind(this)],
            }
        );
    }
}
