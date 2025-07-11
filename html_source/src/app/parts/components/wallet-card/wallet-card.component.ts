import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Wallet } from '@api/models/wallet.model';
import { VariablesService } from '@parts/services/variables.service';
import { BigNumber } from 'bignumber.js';
import { LOCKED_BALANCE_HELP_PAGE } from '@parts/data/constants';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IntToMoneyPipe, IntToMoneyPipeModule } from '@parts/pipes';
import { BackendService } from '@api/services/backend.service';
import { CommonModule } from '@angular/common';
import { DisablePriceFetchModule, TooltipModule } from '@parts/directives';
import { StakingSwitchComponent } from '@parts/components/staking-switch.component';
import { VisibilityBalanceDirective } from '@parts/directives/visibility-balance.directive';
import { MatIconModule } from '@angular/material/icon';
import { AssetBalance } from '@api/models/assets.model';
import { intToMoney } from '@parts/functions/int-to-money';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-wallet-card',
    templateUrl: './wallet-card.component.html',
    standalone: true,
    imports: [
        CommonModule,
        TooltipModule,
        TranslateModule,
        IntToMoneyPipeModule,
        StakingSwitchComponent,
        DisablePriceFetchModule,
        VisibilityBalanceDirective,
        MatIconModule,
        MatTooltipModule,
    ],
    host: {
        class: 'wallet',
    },
})
export class WalletCardComponent {
    @Input() wallet: Wallet;

    @Output() eventClose = new EventEmitter<number>();

    constructor(
        public variablesService: VariablesService,
        private intToMoneyPipe: IntToMoneyPipe,
        private translate: TranslateService,
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
        balances.forEach(({ unlocked, total, asset_info: { ticker } }) => {
            const available = document.createElement('span');
            available.setAttribute('class', 'available');
            available.innerText = `${this.translate.instant('WALLET.AVAILABLE_BALANCE')} `;
            const availableB = document.createElement('b');
            availableB.innerText = `${this.intToMoneyPipe.transform(unlocked)} ${ticker || '---'}`;
            available.appendChild(availableB);
            scrollWrapper.appendChild(available);

            const locked = document.createElement('span');
            locked.setAttribute('class', 'locked');
            locked.innerText = `${this.translate.instant('WALLET.LOCKED_BALANCE')} `;
            const lockedB = document.createElement('b');
            lockedB.innerText = `${this.intToMoneyPipe.transform(new BigNumber(total).minus(unlocked))} ${ticker || '---'}`;
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

    getFiatValue(balance: AssetBalance): string | undefined {
        const priceData = this.variablesService.currentPriceForAssets[balance.asset_info.asset_id]?.data;
        if (!priceData || typeof priceData === 'string') return;

        const {
            settings: { currency },
        } = this.variablesService;
        const fiatPrice = priceData.fiat_prices?.[currency];

        if (!fiatPrice) return;

        const amount = intToMoney(balance.total, balance.asset_info.decimal_point);
        const fiatValue = BigNumber(amount)
            .multipliedBy(fiatPrice)
            .toFixed(BigNumber(fiatPrice).decimalPlaces() ?? 10);

        return `${fiatValue}`;
    }

    getFiatPrice(balance: AssetBalance): {
        value: string | number;
        currency: string;
        change?: string;
        changeClass?: string;
        showChange?: boolean;
    } | null {
        const currentPrice = this.variablesService.currentPriceForAssets[balance.asset_info.asset_id];

        if (!currentPrice || typeof currentPrice.data === 'string') return null;

        const {
            settings: { currency },
        } = this.variablesService;

        const result = {
            value: this.getFiatValue(balance),
            currency: currency.toUpperCase(),
            showChange: false,
        };

        if (currency === 'usd') {
            const change = currentPrice.data.usd_24h_change ?? 0;
            return {
                ...result,
                showChange: change > 0 || change < 0,
                change: change.toFixed(2),
                changeClass: change > 0 ? 'color-aqua' : change < 0 ? 'color-red' : '',
            };
        }

        return result;
    }
}
