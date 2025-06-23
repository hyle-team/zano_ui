import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
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
import { ZANO_ASSET_INFO } from '@parts/data/assets';

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
    ],
})
export class WalletCardComponent {
    @HostBinding('class') classAttr = 'wallet';

    @Input() wallet: Wallet;

    @Output() eventClose = new EventEmitter<number>();

    protected readonly zanoAssetInfo = ZANO_ASSET_INFO;

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
}
