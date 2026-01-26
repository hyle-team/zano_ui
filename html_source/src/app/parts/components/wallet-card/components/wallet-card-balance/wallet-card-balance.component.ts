import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wallet } from '@api/models/wallet.model';
import { DisablePriceFetchModule, TooltipModule } from '@parts/directives';
import { VisibilityBalanceDirective } from '@parts/directives/visibility-balance.directive';
import { BigNumber } from 'bignumber.js';
import { LOCKED_BALANCE_HELP_PAGE } from '@parts/data/constants';
import { IntToMoneyPipe, IntToMoneyPipeModule } from '@parts/pipes';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { MatIconModule } from '@angular/material/icon';
import { intToMoney } from '@parts/functions/int-to-money';
import { isFiatCurrency } from '@parts/data/currencies';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';

@Component({
    selector: 'zano-wallet-card-balance',
    standalone: true,
    imports: [CommonModule, DisablePriceFetchModule, VisibilityBalanceDirective, TooltipModule, MatIconModule, IntToMoneyPipeModule],
    templateUrl: './wallet-card-balance.component.html',
    styleUrls: ['./wallet-card-balance.component.scss'],
})
export class WalletCardBalanceComponent {
    @Input() wallet: Wallet;

    constructor(
        private intToMoneyPipe: IntToMoneyPipe,
        private translate: TranslateService,
        public variablesService: VariablesService,
        private backend: BackendService
    ) {}

    getBalancesTooltip(): HTMLDivElement {
        const tooltip = document.createElement('div');
        const scrollWrapper = document.createElement('div');
        if (!this.wallet || !this.wallet.balances) {
            return null;
        }
        const { balances } = this.wallet;

        scrollWrapper.classList.add('balance-scroll-list');
        balances.forEach(({ unlocked, total, asset_info: { ticker, decimal_point } }) => {
            const available = document.createElement('span');
            available.setAttribute('class', 'available');
            available.innerText = `${this.translate.instant('WALLET.AVAILABLE_BALANCE')} `;
            const availableB = document.createElement('b');
            availableB.innerText = `${this.intToMoneyPipe.transform(unlocked, decimal_point)} ${ticker || '---'}`;
            available.appendChild(availableB);
            scrollWrapper.appendChild(available);

            const locked = document.createElement('span');
            locked.setAttribute('class', 'locked');
            locked.innerText = `${this.translate.instant('WALLET.LOCKED_BALANCE')} `;
            const lockedB = document.createElement('b');
            lockedB.innerText = `${this.intToMoneyPipe.transform(new BigNumber(total).minus(unlocked), decimal_point)} ${ticker || '---'}`;
            locked.appendChild(lockedB);
            scrollWrapper.appendChild(locked);
        });
        tooltip.appendChild(scrollWrapper);
        const link = document.createElement('span');
        link.setAttribute('class', 'link');
        link.innerHTML = this.translate.instant('WALLET.LOCKED_BALANCE_LINK');
        link.addEventListener('click', () => {
            this.backend.openUrlInBrowser(LOCKED_BALANCE_HELP_PAGE);
        });
        tooltip.appendChild(link);
        return tooltip;
    }

    getTotalBalance(): { value: string; currency: string } {
        const {
            currentPriceForAssets,
            settings: { currency },
        } = this.variablesService;

        const displayMode = this.wallet.settings.balanceDisplayMode || 'fiat';

        if (!this.wallet || !this.wallet.balances) {
            return { value: '---', currency: displayMode === 'zano' ? ZANO_ASSET_INFO.ticker : currency.toUpperCase() };
        }

        let totalFiat = new BigNumber(0);
        let hasPositiveBalance = false;
        let anyPriceFoundForPositiveBalance = false;

        this.wallet.balances.forEach((balance) => {
            const amount = intToMoney(balance.total, balance.asset_info.decimal_point);
            const bnAmount = new BigNumber(amount);

            if (bnAmount.isZero()) {
                return;
            }

            hasPositiveBalance = true;

            const priceData = currentPriceForAssets[balance.asset_info.asset_id]?.data;
            if (!priceData || typeof priceData === 'string') return;

            const fiatPrice = priceData.fiat_prices?.[currency];
            if (!fiatPrice) return;

            anyPriceFoundForPositiveBalance = true;
            totalFiat = totalFiat.plus(bnAmount.multipliedBy(fiatPrice));
        });

        if (hasPositiveBalance && !anyPriceFoundForPositiveBalance) {
            return { value: '---', currency: displayMode === 'zano' ? ZANO_ASSET_INFO.ticker : currency.toUpperCase() };
        }

        if (displayMode === 'zano') {
            const zanoBalance = this.wallet.getBalanceByTicker(ZANO_ASSET_INFO.ticker);
            if (!zanoBalance) {
                return { value: '---', currency: ZANO_ASSET_INFO.ticker };
            }

            const zanoPriceData = currentPriceForAssets[zanoBalance.asset_info.asset_id]?.data;
            let zanoFiatPrice;
            if (zanoPriceData && typeof zanoPriceData !== 'string') {
                zanoFiatPrice = zanoPriceData.fiat_prices?.[currency];
            }

            if (!zanoFiatPrice) {
                return { value: '---', currency: ZANO_ASSET_INFO.ticker };
            }

            const totalZano = totalFiat.dividedBy(zanoFiatPrice);
            let str = totalZano.toFixed(zanoBalance.asset_info.decimal_point);
            if (str.includes('.')) {
                str = str.replace(/\.?0+$/, '');
            }

            return {
                value: str,
                currency: ZANO_ASSET_INFO.ticker,
            };
        }

        return {
            value: totalFiat.toFixed(isFiatCurrency(currency) ? 2 : 8),
            currency: currency.toUpperCase(),
        };
    }

    changeBalanceDisplayMode(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.wallet.settings.balanceDisplayMode = this.wallet.settings.balanceDisplayMode === 'zano' ? 'fiat' : 'zano';
    }
}
