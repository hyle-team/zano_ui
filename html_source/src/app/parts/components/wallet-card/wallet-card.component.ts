import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { Wallet } from '@api/models/wallet.model';
import { VariablesService } from '@parts/services/variables.service';
import { Asset } from '@api/models/assets.model';
import { BigNumber } from 'bignumber.js';
import { LOCKED_BALANCE_HELP_PAGE } from '@parts/data/constants';
import { TranslateService } from '@ngx-translate/core';
import { IntToMoneyPipe } from '@parts/pipes';
import { BackendService } from '@api/services/backend.service';

@Component({
  selector: 'app-wallet-card',
  templateUrl: './wallet-card.component.html',
  styleUrls: ['./wallet-card.component.scss'],
})
export class WalletCardComponent {
  @HostBinding('class') classAttr = 'wallet';

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

    scrollWrapper.classList.add('balance-scroll-list');
    this.wallet.balances.forEach(
      ({ unlocked, total, asset_info: { ticker } }: Asset) => {
        const available = document.createElement('span');
        available.setAttribute('class', 'available');
        available.innerHTML = this.translate.instant(
          'WALLET.AVAILABLE_BALANCE',
          {
            available: this.intToMoneyPipe.transform(unlocked),
            currency: ticker || '---',
          }
        );
        scrollWrapper.appendChild(available);
        const locked = document.createElement('span');
        locked.setAttribute('class', 'locked');
        locked.innerHTML = this.translate.instant('WALLET.LOCKED_BALANCE', {
          locked: this.intToMoneyPipe.transform(
            new BigNumber(total).minus(unlocked)
          ),
          currency: ticker || '---',
        });
        scrollWrapper.appendChild(locked);
      }
    );
    tooltip.appendChild(scrollWrapper);
    const link = document.createElement('span');
    link.setAttribute('class', 'link');
    link.innerHTML = this.translate.instant('WALLET.LOCKED_BALANCE_LINK');
    link.addEventListener('click', () => {
      this.openInBrowser();
    });
    tooltip.appendChild(link);
    return tooltip;
  }

  openInBrowser(): void {
    this.backend.openUrlInBrowser(LOCKED_BALANCE_HELP_PAGE);
  }
}
