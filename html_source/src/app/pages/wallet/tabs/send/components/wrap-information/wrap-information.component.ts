import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntToMoneyPipeModule } from '@parts/pipes';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { WrapInfo } from '@api/models/wrap-info';
import { BigNumber } from 'bignumber.js';
import { AssetBalance, PriceInfo } from '@api/models/assets.model';
import { moneyToInt } from '@parts/functions/money-to-int';
import { VariablesService } from '@parts/services/variables.service';

@Component({
    selector: 'zano-wrap-information',
    standalone: true,
    imports: [CommonModule, IntToMoneyPipeModule, MatIconModule, TranslateModule],
    templateUrl: './wrap-information.component.html',
    styleUrls: ['./wrap-information.component.scss'],
})
export class WrapInformationComponent {
    @Input()
    wrap_info: WrapInfo;

    @Input()
    price_info: PriceInfo;

    @Input()
    hide_received_value: boolean;

    @Input()
    amount: any;

    @Input()
    is_currency_input_mode: boolean;

    @Input()
    asset_id: string;

    private readonly _variables_service = inject(VariablesService);

    readonly zano_asset_info = ZANO_ASSET_INFO;

    getReceivedValue(): number | BigNumber {
        const convertedAmount = (): string => {
            let currency_price = 0;
            const {
                settings: { currency },
            } = this._variables_service;
            if (typeof this.price_info.data === 'object') {
                const { data } = this.price_info;
                currency_price = data.fiat_prices[currency] ?? 0;
            }

            let decimal_point = 0;
            const { current_wallet } = this._variables_service;
            const asset: AssetBalance | undefined = current_wallet.getBalanceByAssetId(this.asset_id);

            if (asset) {
                const { asset_info } = asset;
                decimal_point = asset_info.decimal_point;
            }

            const convertedAmount = BigNumber(this.amount || 0)
                .dividedBy(currency_price)
                .decimalPlaces(decimal_point);

            return convertedAmount.toString();
        };
        const prepared_amount: BigNumber = moneyToInt(this.is_currency_input_mode ? convertedAmount() : this.amount || '0');

        const {
            tx_cost: { zano_needed_for_erc20 },
        } = this.wrap_info;
        const needed: BigNumber = new BigNumber(zano_needed_for_erc20);

        if (prepared_amount && needed) {
            return prepared_amount.minus(needed);
        }
        return 0;
    }
}
