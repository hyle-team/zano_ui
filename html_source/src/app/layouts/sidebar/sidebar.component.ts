import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { ModalService } from '@parts/services/modal.service';
import {
  DOWNLOADS_PAGE_URL,
  LOCKED_BALANCE_HELP_PAGE,
} from '@parts/data/constants';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Wallet } from '@api/models/wallet.model';
import { TranslateService } from '@ngx-translate/core';
import { IntToMoneyPipe } from '@parts/pipes/int-to-money-pipe/int-to-money.pipe';
import { Asset } from '@api/models/assets.model';
import { BigNumber } from 'bignumber.js';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isModalDialogVisible = false;

  closeWalletId: number;

  constructor(
    public variablesService: VariablesService,
    private route: ActivatedRoute,
    private router: Router,
    private backend: BackendService,
    private modal: ModalService,
    private translate: TranslateService,
    private intToMoneyPipe: IntToMoneyPipe,
    private ngZone: NgZone
  ) {}

  goMainPage(): void {
    if (
      this.route.snapshot.queryParams &&
      this.route.snapshot.queryParams.prevUrl === 'login'
    ) {
      this.ngZone.run(() => {
        this.router.navigate(['/'], { queryParams: { prevUrl: 'login' } });
      });
    } else {
      this.ngZone.run(() => {
        this.router.navigate(['/']);
      });
    }
  }

  selectWallet(id: number): void {
    this.ngZone.run(() => {
      this.variablesService.setCurrentWallet(id);
      this.router.navigate(['/wallet/assets']);
    });
  }

  contactsRoute(): void {
    if (this.variablesService.appPass) {
      this.ngZone.run(() => {
        this.router.navigate(['/contacts']);
      });
    } else {
      this.modal.prepareModal(
        'error',
        'CONTACTS.FORM_ERRORS.SET_MASTER_PASSWORD'
      );
    }
  }

  drop(event: CdkDragDrop<Wallet[]>): void {
    moveItemInArray(
      this.variablesService.wallets,
      event.previousIndex,
      event.currentIndex
    );
  }

  showDialog(wallet_id): void {
    this.isModalDialogVisible = true;
    this.closeWalletId = wallet_id;
  }

  confirmed(confirmed: boolean): void {
    if (confirmed) {
      this.closeWallet(this.closeWalletId);
    }
    this.isModalDialogVisible = false;
  }

  closeWallet(wallet_id): void {
    this.backend.closeWallet(wallet_id, () => {
      for (let i = this.variablesService.wallets.length - 1; i >= 0; i--) {
        if (
          this.variablesService.wallets[i].wallet_id ===
          this.variablesService.currentWallet.wallet_id
        ) {
          this.variablesService.wallets.splice(i, 1);
        }
      }
      this.ngZone.run(() => {
        if (this.variablesService.wallets.length > 0) {
          this.variablesService.currentWallet =
            this.variablesService.wallets[0];
          this.router.navigate(['/wallet/']);
        } else {
          this.router.navigate(['/']);
        }
      });
      if (this.variablesService.appPass) {
        this.backend.storeSecureAppData();
      }
    });
  }

  logOut(): void {
    this.variablesService.stopCountdown();
    this.variablesService.appLogin = false;
    this.variablesService.appPass = '';
    this.ngZone.run(() => {
      this.router.navigate(['/login'], { queryParams: { type: 'auth' } });
    });
  }

  getBalanceTooltip(id: number): null | any {
    const wallet = this.variablesService.getWallet(id);
    const tooltip = document.createElement('div');
    const scrollWrapper = document.createElement('div');
    if (!wallet || !wallet.balances || !tooltip || !scrollWrapper) {
      return null;
    }

    scrollWrapper.classList.add('balance-scroll-list');
    wallet.balances.forEach(
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
      this.openInBrowser(LOCKED_BALANCE_HELP_PAGE);
    });
    tooltip.appendChild(link);
    return tooltip;
  }

  openInBrowser(link): void {
    this.backend.openUrlInBrowser(link);
  }
}
