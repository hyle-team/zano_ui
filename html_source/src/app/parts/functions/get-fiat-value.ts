import { AssetBalance } from '@api/models/assets.model';
import { intToMoney } from '@parts/functions/int-to-money';
import { BigNumber } from 'bignumber.js';
import { isFiatCurrency } from '@parts/data/currencies';
import { CurrentPriceForAssets } from '@api/models/api-zano.models';

export const getFiatValue = (balance: AssetBalance, currentPriceForAssets: CurrentPriceForAssets, currency: string): string | null => {
    const priceData = currentPriceForAssets[balance.asset_info.asset_id]?.data;
    if (!priceData || typeof priceData === 'string') return null;

    const fiatPrice = priceData.fiat_prices?.[currency];
    if (!fiatPrice) return null;

    const amount = intToMoney(balance.total, balance.asset_info.decimal_point);
    const fiatValue = BigNumber(amount)
        .multipliedBy(fiatPrice)
        .toFixed((isFiatCurrency(currency) ? 2 : BigNumber(amount).isZero() ? 0 : BigNumber(fiatPrice).decimalPlaces()) ?? 10);

    return `${fiatValue}`;
};
