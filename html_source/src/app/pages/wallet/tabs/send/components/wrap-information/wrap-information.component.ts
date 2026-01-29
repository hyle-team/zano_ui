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
import { DestinationFormGroup } from '../../send.component';

@Component({
    selector: 'zano-wrap-information',
    standalone: true,
    imports: [CommonModule, IntToMoneyPipeModule, MatIconModule, TranslateModule],
    templateUrl: './wrap-information.component.html',
    styleUrls: ['./wrap-information.component.scss'],
})
export class WrapInformationComponent {
    @Input('formRef') form: DestinationFormGroup;

    readonly variablesService = inject(VariablesService);

    readonly ZANO_ASSET_INFO = ZANO_ASSET_INFO;

    getReceivedValue(): number | BigNumber {
        const { asset_id, amount, is_currency_input_mode } = this.form.getRawValue();
        const {
            wrap_info$: { value: wrap_info },
        } = this.variablesService;

        const convertedAmount = (): string => {
            let currency_price = 0;
            const {
                settings: { currency },
                currentPriceForAssets,
            } = this.variablesService;

            if (currentPriceForAssets[asset_id]) {
                const { data } = currentPriceForAssets[asset_id];
                currency_price = typeof data === 'object' ? data.fiat_prices[currency] ?? 0 : 0;
            }

            let decimal_point = 0;
            const { current_wallet } = this.variablesService;
            const assetBalance: AssetBalance | undefined = current_wallet.getBalanceByAssetId(asset_id);

            if (assetBalance) {
                const { asset_info } = assetBalance;
                decimal_point = asset_info.decimal_point;
            }

            const convertedAmount = BigNumber(amount || 0)
                .dividedBy(currency_price)
                .decimalPlaces(decimal_point);

            return convertedAmount.toString();
        };
        const prepared_amount: BigNumber = moneyToInt(is_currency_input_mode ? convertedAmount() : amount || '0');

        if (!wrap_info) return 0;

        const {
            tx_cost: { zano_needed_for_erc20 },
        } = wrap_info;
        const needed: BigNumber = new BigNumber(zano_needed_for_erc20);

        if (prepared_amount && needed) {
            return prepared_amount.minus(needed);
        }
        return 0;
    }
}
