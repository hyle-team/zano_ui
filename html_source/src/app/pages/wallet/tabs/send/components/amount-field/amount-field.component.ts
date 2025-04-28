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
import { ZANO_ASSET_INFO } from '@parts/data/assets';

interface AmountInputParams {
    decimalPoint: number;
    inputTicker: string;
    hintTicker: string;
    hintAmount: string;
    reverseDisabled: boolean;
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
        TooltipModule
    ],
    templateUrl: './amount-field.component.html',
    styleUrls: ['./amount-field.component.scss']
})
export class AmountFieldComponent implements OnInit, OnDestroy, OnChanges {
    @Input() control_ref: DestinationsForm;

    @Input()
    price_info: PriceInfo = {
        success: false,
        data: 'Asset not found'
    };

    price_info$: Subject<PriceInfo> = new Subject<PriceInfo>();

    variables_service: VariablesService = inject(VariablesService);

    amount_input_params: AmountInputParams = {
        decimalPoint: ZANO_ASSET_INFO.decimal_point,
        inputTicker: ZANO_ASSET_INFO.ticker,
        hintTicker: '',
        hintAmount: '',
        reverseDisabled: true
    };

    private readonly _destroy$: Subject<void> = new Subject<void>();

    constructor() {}

    ngOnInit(): void {
        const { current_wallet } = this.variables_service;
        const { controls } = this.control_ref;

        combineLatest([
            controls.asset_id.valueChanges.pipe(startWith(controls.asset_id.value)),
            controls.is_amount_usd.valueChanges.pipe(startWith(controls.is_amount_usd.value), distinctUntilChanged()),
            controls.amount.valueChanges.pipe(startWith(controls.amount.value)),
            this.price_info$
        ])
            .pipe(
                map(([asset_id, is_amount_usd, amount, priceInfo]) => {
                    const { decimal_point, ticker } = current_wallet.getBalanceByAssetId(asset_id)?.asset_info ?? {};

                    const params: AmountInputParams = {
                        decimalPoint: decimal_point,
                        inputTicker: ticker,
                        hintTicker: 'USD',
                        hintAmount: '0',
                        reverseDisabled: false
                    };

                    const { success } = priceInfo;

                    if (success) {
                        const { data } = priceInfo;

                        let usd = 0;

                        if (typeof data === 'object') {
                            usd = data.usd;
                        }

                        if (is_amount_usd) {
                            params.decimalPoint = 2;
                            params.inputTicker = 'USD';
                            params.hintTicker = ticker;
                            params.hintAmount = `~ ${new BigNumber(+amount || 0).dividedBy(usd || 0).decimalPlaces(decimal_point)}`;
                        } else {
                            params.decimalPoint = decimal_point;
                            params.inputTicker = ticker;
                            params.hintTicker = 'USD';
                            params.hintAmount = `~ ${new BigNumber(usd || 0).multipliedBy(+amount || 0).decimalPlaces(2)}`;
                        }
                    } else {
                        params.reverseDisabled = true;
                        controls.is_amount_usd.patchValue(false);
                    }

                    return params;
                })
            )
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: params => {
                    this.amount_input_params = params;
                    this.control_ref.updateValueAndValidity();
                }
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            if (changes.price_info) {
                this.price_info$.next(changes.price_info.currentValue);
            }
        }, 150);
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    toggleAmountUSD(): void {
        const { is_amount_usd } = this.control_ref.getRawValue();
        this.control_ref.controls.is_amount_usd.patchValue(!is_amount_usd);
    }
}
