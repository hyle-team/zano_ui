import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputValidateModule, TooltipModule } from '@parts/directives';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PriceInfo } from '@api/models/assets.model';
import { combineLatest, Subject } from 'rxjs';
import { VariablesService } from '@parts/services/variables.service';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { BigNumber } from 'bignumber.js';
import { DestinationsForm } from '../../send.component';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { MatTooltipModule } from '@angular/material/tooltip';

interface AmountInputParams {
    decimalPoint: number;
    inputTicker: string;
    hintTicker: string;
    hintAmount: string;
    toggleInputModeDisabled: boolean;
}

const default_price_info: PriceInfo = {
    success: false,
    data: 'Asset not found',
};

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
export class AmountFieldComponent implements OnInit, OnDestroy, OnChanges {
    @Input() control_ref: DestinationsForm;

    @Input()
    price_info: PriceInfo = default_price_info;

    price_info$ = new Subject<PriceInfo>();

    variables_service = inject(VariablesService);

    amount_input_params: AmountInputParams = {
        decimalPoint: ZANO_ASSET_INFO.decimal_point,
        inputTicker: ZANO_ASSET_INFO.ticker,
        hintTicker: '',
        hintAmount: '',
        toggleInputModeDisabled: true,
    };

    private readonly _destroy$ = new Subject<void>();

    ngOnInit(): void {
        const { controls } = this.control_ref;

        combineLatest([
            controls.asset_id.valueChanges.pipe(startWith(controls.asset_id.value)),
            controls.is_currency_input_mode.valueChanges.pipe(startWith(controls.is_currency_input_mode.value), distinctUntilChanged()),
            controls.amount.valueChanges.pipe(startWith(controls.amount.value)),
            this.price_info$,
        ])
            .pipe(
                map(([asset_id, is_currency_input_mode, amount, priceInfo]) =>
                    this._buildAmountInputParams(asset_id, is_currency_input_mode, amount, priceInfo)
                ),
                takeUntil(this._destroy$)
            )
            .subscribe((params) => {
                this.amount_input_params = params;
                this.control_ref.updateValueAndValidity();
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.price_info) {
            setTimeout(() => {
                this.price_info$.next(changes.price_info.currentValue);
            }, 150);
        }
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    toggleInputMode(): void {
        const { is_currency_input_mode } = this.control_ref.getRawValue();
        this.control_ref.controls.is_currency_input_mode.patchValue(!is_currency_input_mode);
    }

    private _buildAmountInputParams(
        asset_id: string,
        is_currency_input_mode: boolean,
        amount: number | string,
        priceInfo: PriceInfo
    ): AmountInputParams {
        const { current_wallet, settings } = this.variables_service;
        const asset = current_wallet.getBalanceByAssetId(asset_id)?.asset_info;
        const decimalPoint = asset?.decimal_point ?? ZANO_ASSET_INFO.decimal_point;
        const assetTicker = asset?.ticker ?? ZANO_ASSET_INFO.ticker;
        const currencyTicker = settings.currency.toUpperCase();

        const params: AmountInputParams = {
            decimalPoint,
            inputTicker: assetTicker,
            hintTicker: currencyTicker,
            hintAmount: '0',
            toggleInputModeDisabled: false,
        };

        if (!priceInfo.success) {
            params.toggleInputModeDisabled = true;
            this.control_ref.controls.is_currency_input_mode.patchValue(false);
            return params;
        }

        const currency_price =
            typeof priceInfo.data === 'object' && priceInfo.data !== null ? priceInfo.data.fiat_prices?.[settings.currency] ?? 0 : 0;

        const fiatDecimalPlaces = (this.variables_service.isFiatCurrency(settings.currency) ? 2 : BigNumber(currency_price).decimalPlaces()) ?? 2;
        if (is_currency_input_mode) {
            const converted = BigNumber(+amount || 0)
                .dividedBy(currency_price)
                .decimalPlaces(decimalPoint);

            return {
                ...params,
                decimalPoint: fiatDecimalPlaces,
                inputTicker: currencyTicker,
                hintTicker: assetTicker,
                hintAmount: `~ ${converted.toString()}`,
            };
        } else {
            const hintValue = BigNumber(currency_price)
                .multipliedBy(+amount || 0)
                .decimalPlaces(fiatDecimalPlaces)
                .toString();

            return {
                ...params,
                decimalPoint,
                inputTicker: assetTicker,
                hintTicker: currencyTicker,
                hintAmount: `~ ${hintValue}`,
            };
        }
    }
}
