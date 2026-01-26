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
import { AssetBalance } from '@api/models/assets.model';
import { VariablesService } from '@parts/services/variables.service';
import { MatIconModule } from '@angular/material/icon';
import { getFiatValue } from '@parts/functions/get-fiat-value';

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

    getViewBalanceData(balance: AssetBalance): {
        value: string | number;
        currency: string;
    } | null {
        const {
            currentPriceForAssets,
            settings: { currency },
        } = this.variablesService;
        const value = getFiatValue(balance, currentPriceForAssets, currency);

        if (!value) return { value: '---', currency: currency.toUpperCase() };

        return {
            value,
            currency: currency.toUpperCase(),
        };
    }

    changeBalanceDisplayMode(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.wallet.settings.balanceDisplayMode = this.wallet.settings.balanceDisplayMode === 'zano' ? 'fiat' : 'zano';
    }
}
