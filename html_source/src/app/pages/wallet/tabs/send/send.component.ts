import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { BigNumber } from 'bignumber.js';
import { MIXIN } from '@parts/data/constants';
import { debounceTime, delay, filter, map, retry, startWith, take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { AssetBalance } from '@api/models/assets.model';
import { regExpAliasName } from '@parts/utils/zano-validators';
import { IntToMoneyPipe } from '@parts/pipes';
import { insuficcientFunds } from '@parts/utils/zano-errors';
import { Alias, Aliases } from '@api/models/alias.model';
import { DeeplinkParams, defaultSendMoneyParams } from '@api/models/wallet.model';
import { WrapInfo } from '@api/models/wrap-info';
import { WrapInfoService } from '@api/services/wrap-info.service';
import { SendMoneyParams } from '@api/models/send-money.model';
import { defaultImgSrc, ZanoAssetInfo, zanoAssetInfo } from '@parts/data/assets';
import { moneyToInt } from '@parts/functions/money-to-int';
import { intToMoney } from '@parts/functions/int-to-money';

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
    zanoAssetInfo: ZanoAssetInfo = zanoAssetInfo;

    defaultImgSrc: string = defaultImgSrc;

    job_id: number;

    controllerVisibleDropdownAliasesState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    isVisibleDropdownAliasesState$: Observable<boolean> = this.controllerVisibleDropdownAliasesState$.pipe(delay(250));

    isSendModalState: boolean = false;

    isSendDetailsModalState: boolean = false;

    hideWalletAddress: boolean = false;

    wrapInfo: WrapInfo;

    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    isVisibleWrapInfoState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    aliasAddress: string;

    isVisibleAdditionalOptionsState: boolean = false;

    fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    intToMoneyPipe: IntToMoneyPipe = inject(IntToMoneyPipe);

    variablesService: VariablesService = inject(VariablesService);

    wrapInfoService: WrapInfoService = inject(WrapInfoService);

    items$: Observable<(AssetBalance & { disabled: boolean })[]> = combineLatest([
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

    aliases$: BehaviorSubject<Aliases> = new BehaviorSubject<Aliases>([]);

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

    decimal_point$: Observable<number>;

    private destroy$: Subject<void> = new Subject<void>();

    constructor(private backendService: BackendService, private ngZone: NgZone) {}

    ngOnInit(): void {
        const { aliases } = this.variablesService;
        this.aliases$.next(aliases);

        this._getWrapInfo();

        this._createForm();
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

    isVisibleErrorByForm(form: FormGroup): boolean {
        return form.invalid && (form.dirty || form.touched);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    showSendModal(): void {
        this.isSendModalState = true;
    }

    handleConfirmed(confirmed: boolean): void {
        this.isSendModalState = false;
        if (confirmed) {
            this.send();
        }
    }

    send(): void {
        if (this.form.invalid) {
            return;
        }

        let sendMoneyParams: SendMoneyParams = this.form.getRawValue();
        const { address, asset_id, amount } = sendMoneyParams;

        const { currentWallet } = this.variablesService;
        const asset: AssetBalance | undefined = currentWallet.getBalanceByAssetId(asset_id);

        if (asset) {
            const {
                asset_info: { decimal_point },
            } = asset;
            sendMoneyParams = {
                ...sendMoneyParams,
                amount: moneyToInt(amount, decimal_point).toString(),
            };
        } else {
            this.form.controls.asset_id.setErrors({
                asset_not_found: true,
            });
            return;
        }

        if (address.indexOf('@') === 0) {
            const aliasName = address;
            const alias = this.aliases$.value.find(({ name }) => name === aliasName);

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

        this.backendService.sendMoney(sendMoneyParams, (job_id: number) => {
            this.ngZone.run(() => {
                this.job_id = job_id;
                this.isSendDetailsModalState = true;
                this.variablesService.currentWallet.sendMoneyParams = null;
            });
        });
    }

    getReceivedValue(): number | BigNumber {
        const amount: BigNumber = moneyToInt(this.form.value.amount);
        const needed: BigNumber = new BigNumber(this.wrapInfo.tx_cost.zano_needed_for_erc20);
        if (amount && needed) {
            return amount.minus(needed);
        }
        return 0;
    }

    handeCloseSendDetailsModal(success: boolean): void {
        this.isSendDetailsModalState = false;
        this.job_id = null;

        if (success) {
            const {
                currentWallet: { wallet_id },
            } = this.variablesService;
            this.variablesService.currentWallet.sendMoneyParams = null;
            this.form.reset({ ...defaultSendMoneyParams, wallet_id }, { emitEvent: false });
        }
    }

    pasteListenAddressField(event: ClipboardEvent): void {
        event.preventDefault();

        const { clipboardData } = event;
        let value = clipboardData.getData('Text') ?? '';
        this.lowerCaseDisabled$.next(value.indexOf('@') !== 0);

        if (value.indexOf('@') === 0) {
            value = value.toLowerCase();
        }
        this.form.controls.address.patchValue(value);
    }

    inputListenAddressField({ target: { value } }: any): void {
        const { aliases } = this.variablesService;

        of(value ?? '')
            .pipe(
                tap(v => this.lowerCaseDisabled$.next(v.indexOf('@') !== 0)),
                tap(v => this.controllerVisibleDropdownAliasesState$.next(!!v.length && v.indexOf('@') === 0)),
                filter(v => v.indexOf('@') === 0),
                take(1)
            )
            .subscribe({
                next: v => {
                    const filteredAliases: Alias[] = aliases.filter(({ name }) => {
                        return name.indexOf(v) > -1;
                    });
                    this.aliases$.next(filteredAliases);
                },
            });
    }

    private _createForm(): void {
        const { currentWallet, default_fee, maxCommentLength, max_amount_for_send } = this.variablesService;

        let sendMoneyParams: SendMoneyParams;

        if (currentWallet.sendMoneyParams) {
            sendMoneyParams = currentWallet.sendMoneyParams;
        } else {
            sendMoneyParams = {
                ...defaultSendMoneyParams,
                wallet_id: currentWallet.wallet_id,
                fee: default_fee,
            };
        }

        if (currentWallet.is_auditable && !currentWallet.is_watch_only) {
            sendMoneyParams.hide = true;
        }

        if (currentWallet.is_auditable) {
            sendMoneyParams.mixin = 0;
        }

        const state = history.state || {};
        const history_asset: AssetBalance = state['asset'];

        if (history_asset) {
            const {
                asset_info: { asset_id, decimal_point },
            } = history_asset;
            sendMoneyParams.asset_id = asset_id;
            if (sendMoneyParams.amount) {
                sendMoneyParams.amount = intToMoney(moneyToInt(sendMoneyParams.amount, decimal_point), decimal_point);
            }
        }

        this.form = this.fb.group(
            {
                wallet_id: this.fb.control<number>(sendMoneyParams.wallet_id, {
                    validators: [Validators.required],
                }),
                address: this.fb.control<string>(sendMoneyParams.address, {
                    validators: [
                        Validators.required,
                        (control: AbstractControl): ValidationErrors | null => {
                            this.aliasAddress = '';
                            if (control.value) {
                                if (control.value.indexOf('@') !== 0) {
                                    this.backendService.validateAddress(control.value, (valid_status, data) => {
                                        this.ngZone.run(() => {
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
                                        this.backendService.getAliasInfoByName(
                                            control.value.replace('@', ''),
                                            (alias_status, alias_data) => {
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
                amount: this.fb.control<string>(sendMoneyParams.amount, {
                    validators: [
                        Validators.required,
                        (control: AbstractControl): ValidationErrors | null => {
                            const max: BigNumber = max_amount_for_send;
                            const amount: BigNumber = new BigNumber(control.value);
                            return amount.isGreaterThan(max) ? { greater_than_max_amount: { max: max.toString() } } : null;
                        },
                        (control: AbstractControl): ValidationErrors | null => {
                            const isZero = new BigNumber(control.value).eq(0);
                            if (isZero) {
                                return { zero: true };
                            }

                            if (!control.value) {
                                return null;
                            }

                            const amount: BigNumber = moneyToInt(control.value);

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
                comment: this.fb.control<string>(sendMoneyParams.comment, {
                    validators: [Validators.maxLength(maxCommentLength)],
                }),
                asset_id: this.fb.control<string>(sendMoneyParams.asset_id, {
                    validators: [Validators.required],
                }),
                mixin: this.fb.control<number>(
                    { value: sendMoneyParams.mixin, disabled: currentWallet.is_auditable },
                    {
                        validators: [Validators.required, Validators.min(0), Validators.max(1000)],
                    }
                ),
                fee: this.fb.control<string>(sendMoneyParams.fee, {
                    validators: [
                        Validators.required,
                        (control: AbstractControl): ValidationErrors | null => {
                            const max: BigNumber = max_amount_for_send;
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
                hide: this.fb.control<boolean>({
                    value: sendMoneyParams.hide,
                    disabled: currentWallet.is_auditable && !currentWallet.is_watch_only,
                }),
            },
            {
                validators: [
                    (form: FormGroup): ValidationErrors | null => {
                        const asset_id = form.controls.asset_id.getRawValue();
                        const amount = form.controls.amount.getRawValue();

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

                        const preparedUnlocked = intToMoney(unlocked, decimal_point);
                        return new BigNumber(amount).isGreaterThan(preparedUnlocked) ? { insuficcientFunds } : null;
                    },
                ],
            }
        );

        if (currentWallet.sendMoneyParams) {
            this.form.markAllAsTouched();
        }

        this._listenSendActionData();

        this.form.valueChanges.pipe(debounceTime(200), takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.variablesService.currentWallet.sendMoneyParams = this.form.getRawValue();
            },
        });

        this.decimal_point$ = this.form.controls.asset_id.valueChanges.pipe(
            startWith(this.form.controls.asset_id.value),
            map((asset_id: string) => {
                return currentWallet.getBalanceByAssetId(asset_id)?.asset_info.decimal_point ?? 0;
            })
        );
    }

    private _getWrapInfo(): void {
        this.wrapInfoService
            .getWrapInfo()
            .pipe(
                tap(() => this.loading$.next(true)),
                retry(5),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (wrapInfo: WrapInfo) => {
                    this.wrapInfo = wrapInfo;
                    this.loading$.next(false);
                },
                error: () => {
                    this.loading$.next(false);
                },
                complete: () => {
                    this.loading$.next(false);
                },
            });
    }

    private _listenSendActionData(): void {
        this.variablesService.sendActionData$.pipe(takeUntil(this.destroy$)).subscribe({
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
