import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputValidateModule, TooltipModule } from '@parts/directives';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AssetBalance, AssetInfo, PriceInfo } from '@api/models/assets.model';
import { combineLatest, Observable } from 'rxjs';
import { VariablesService } from '@parts/services/variables.service';
import { distinctUntilChanged, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { BigNumber } from 'bignumber.js';
import { DestinationFormGroup } from '../../send.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { isFiatCurrency } from '@parts/data/currencies';
import { intToMoney } from '@parts/functions/int-to-money';

interface AmountInputParams {
    decimalPoint: number;
    inputTicker: string;
    hintLeftText: string;
    hintRightText: string;
    toggleInputModeDisabled: boolean;
}

@Component({
    selector: 'zano-amount-field',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputValidateModule,
        IsVisibleControlErrorPipe,
        MatIconModule,
        ReactiveFormsModule,
        TranslateModule,
        TooltipModule,
        MatTooltipModule,
    ],
    templateUrl: './amount-field.component.html',
    styleUrls: ['./amount-field.component.scss'],
})
export class AmountFieldComponent implements OnInit {
    @Input('formRef') form: DestinationFormGroup;

    variablesService = inject(VariablesService);

    amountInputParams$: Observable<AmountInputParams>;

    ngOnInit(): void {
        const { controls } = this.form;

        const assetId$ = controls.asset_id.valueChanges.pipe(startWith(controls.asset_id.value));
        const isCurrencyInputMode$ = controls.is_currency_input_mode.valueChanges.pipe(
            startWith(controls.is_currency_input_mode.value),
            distinctUntilChanged()
        );
        const amount$ = controls.amount.valueChanges.pipe(startWith(String(controls.amount.value ?? '')));
        const currentPriceForAssets$ = this.variablesService.currentPriceForAssets$;

        this.amountInputParams$ = combineLatest([assetId$, isCurrencyInputMode$, amount$, currentPriceForAssets$]).pipe(
            map(([assetId, isCurrencyInputMode, amount]) =>
                this._buildAmountInputParams(assetId, isCurrencyInputMode, String(amount ?? ''))
            ),
            tap(params => {
                if (params.toggleInputModeDisabled) {
                    this.form.controls.is_currency_input_mode.patchValue(false, { emitEvent: false });
                }
            }),
            shareReplay(1)
        );
    }

    toggleInputMode(): void {
        const { is_currency_input_mode } = this.form.getRawValue();
        this.form.controls.is_currency_input_mode.patchValue(!is_currency_input_mode);
    }

    private _buildAmountInputParams(
        assetId: string,
        isCurrencyInputMode: boolean,
        amount: string
    ): AmountInputParams {
        const { current_wallet, settings } = this.variablesService;
        const assetBalance = current_wallet.getBalanceByAssetId(assetId);

        if (!assetBalance) {
            return {
                decimalPoint: 12,
                inputTicker: '',
                hintLeftText: '',
                hintRightText: '',
                toggleInputModeDisabled: true,
            };
        }

        const assetInfo = assetBalance.asset_info;
        const priceInfo = this.variablesService.currentPriceForAssets[assetId];
        const currencyTicker = settings.currency.toUpperCase();

        const params = this._createParams(assetBalance, assetInfo, currencyTicker);

        if (!priceInfo?.success) {
            return {
                ...params,
                toggleInputModeDisabled: true,
            };
        }

        const currencyPrice = this._getCurrencyPrice(priceInfo, settings.currency);
        const fiatDecimalPlaces = this._getFiatDecimalPlaces(currencyPrice, settings.currency);

        if (isCurrencyInputMode) {
            return this._createCurrencyParams(params, amount, currencyPrice, assetInfo, fiatDecimalPlaces, currencyTicker);
        } else {
            return this._createAssetParams(params, amount, currencyPrice, fiatDecimalPlaces, currencyTicker);
        }
    }

    private _createParams(
        assetBalance: AssetBalance,
        assetInfo: AssetInfo,
        currencyTicker: string
    ): AmountInputParams {
        const decimalPoint = assetInfo.decimal_point ?? 12;
        const assetTicker = assetInfo.ticker ?? '';
        const availableAmount = intToMoney(assetBalance.unlocked, decimalPoint);

        return {
            decimalPoint,
            inputTicker: assetTicker,
            hintLeftText: `0 ${currencyTicker}`,
            hintRightText: `${availableAmount} ${assetTicker}`,
            toggleInputModeDisabled: false,
        };
    }

    private _getCurrencyPrice(priceInfo: PriceInfo, currency: string): number {
        if (typeof priceInfo.data === 'object' && priceInfo.data !== null) {
            return priceInfo.data.fiat_prices?.[currency] ?? 0;
        }
        return 0;
    }

    private _getFiatDecimalPlaces(currencyPrice: number, currency: string): number {
        if (isFiatCurrency(currency)) {
            return 2;
        }
        return BigNumber(currencyPrice).decimalPlaces() ?? 2;
    }

    private _createCurrencyParams(
        defaultParams: AmountInputParams,
        amount: string,
        currencyPrice: number,
        assetInfo: AssetInfo,
        fiatDecimalPlaces: number,
        currencyTicker: string
    ): AmountInputParams {
        const converted = BigNumber(amount || 0)
            .dividedBy(currencyPrice)
            .decimalPlaces(assetInfo.decimal_point ?? 12);

        return {
            ...defaultParams,
            decimalPoint: fiatDecimalPlaces,
            inputTicker: currencyTicker,
            hintLeftText: `~ ${converted.toString()} ${assetInfo.ticker ?? ''}`,
        };
    }

    private _createAssetParams(
        defaultParams: AmountInputParams,
        amount: string,
        currencyPrice: number,
        fiatDecimalPlaces: number,
        currencyTicker: string
    ): AmountInputParams {
        const hintValue = BigNumber(currencyPrice)
            .multipliedBy(amount || 0)
            .decimalPlaces(fiatDecimalPlaces)
            .toString();

        return {
            ...defaultParams,
            hintLeftText: `~ ${hintValue} ${currencyTicker}`,
        };
    }
}
