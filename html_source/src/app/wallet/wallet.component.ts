import { Component, HostListener, NgZone, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from '../_helpers/services/variables.service';
import { BackendService } from '../_helpers/services/backend.service';
import { TranslateService } from '@ngx-translate/core';
import { IntToMoneyPipe } from '../_helpers/pipes/int-to-money.pipe';
import { Subject } from 'rxjs';
import { Store, Sync } from 'store';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit, OnDestroy {
  settingsButtonInterval;

  settingsButtonDisabled = true;

  walletLoaded = false;

  openDropdown: boolean;

  delWalletDialogVisible = false;

  exportHistoryDialogVisible = false;

  stateVisibleAddCustomToken = false;

  closeWalletId: number;

  walletSyncVisible = false;

  tabs = [
    {
      title: 'WALLET.TABS.HISTORY',
      icon: 'time-circle',
      link: '/history',
      disabled: false
    },
    {
      title: 'WALLET.TABS.SEND',
      icon: 'arrow-up-square',
      link: '/send',
      disabled: true
    },
    {
      title: 'WALLET.TABS.RECEIVE',
      icon: 'arrow-down-square',
      link: '/receive',
      disabled: false
    },
    {
      title: 'WALLET.TABS.CONTRACTS',
      icon: 'document',
      link: '/contracts',
      disabled: true
    },
    {
      title: 'WALLET.TABS.STAKING',
      icon: 'staking',
      link: '/staking',
      indicator: false,
      disabled: true
    },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backend: BackendService,
    public variablesService: VariablesService,
    private ngZone: NgZone,
    private translate: TranslateService,
    private intToMoneyPipe: IntToMoneyPipe,
    private store: Store
  ) {
    if (!this.variablesService.currentWallet && this.variablesService.wallets.length > 0) {
      this.variablesService.setCurrentWallet(0);
    }
    this.walletLoaded = this.variablesService.currentWallet.loaded;
  }

  @HostListener('document:keydown.shift', ['$event.key'])
  onKeyPressed(): void {
    if (!this.openDropdown) {
      this.walletSyncVisible = true;
    }
  }

  @HostListener('document:keyup.shift', ['$event.key'])
  onKeyUpPressed(): void {
    if (!this.openDropdown) {
      this.walletSyncVisible = false;
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement): void {
    if (targetElement.dataset.target !== 'wallet-dropdown-button' && this.openDropdown) {
      this.openDropdown = false;
      this.walletSyncVisible = false;
    }
  }

  ngOnInit(): void {
    this.settingsButtonInterval = setInterval(() => {
      // tslint:disable-next-line:triple-equals
      if (this.variablesService.daemon_state == 2 || this.walletLoaded) {
        this.settingsButtonDisabled = false;
        clearInterval(this.settingsButtonInterval);
      }
    }, 1000);
    this.store
      .select('sync')
      .pipe(filter(Boolean), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value: any) => {
        const data = value.filter(
          (item: Sync) => item.wallet_id === this.variablesService.currentWallet.wallet_id
        )[0];
        if (data && !data.sync) {
          let in_progress;
          const values = this.store.value.sync;
          if (values && values.length) {
            in_progress = values.filter((item) => item.sync);
            this.variablesService.sync_started = !!(
              in_progress && in_progress.length
            );
            if (!in_progress) {
              this.variablesService.sync_started = false;
            }
          } else {
            this.variablesService.sync_started = false;
          }
        }
      });
    if (this.variablesService.currentWallet.alias.hasOwnProperty('name')) {
      this.variablesService.currentWallet.wakeAlias = false;
    }
    this.variablesService.getAliasChangedEvent.pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        if (this.variablesService.currentWallet.alias.hasOwnProperty('name')) {
          this.variablesService.currentWallet.wakeAlias = false;
        }
      }
    );
    this.updateWalletStatus();
    this.variablesService.getWalletChangedEvent.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setTabsDisabled(this.variablesService.currentWallet.balance.eq(0));
    });
  }

  toggleMenuDropdown(): void {
    if (!this.openDropdown) {
      this.openDropdown = true;
    } else {
      this.openDropdown = false;
      this.walletSyncVisible = false;
    }
  }

  resyncCurrentWallet(id): void {
    this.backend.resyncWallet(id);
  }

  showConfirmDialog(wallet_id): void {
    this.delWalletDialogVisible = true;
    this.closeWalletId = wallet_id;
  }

  closeExportModal(confirmed: boolean): void {
    if (confirmed) {
      this.exportHistoryDialogVisible = false;
    }
  }

  confirmed(confirmed: boolean): void {
    if (confirmed) {
      this.closeWallet(this.closeWalletId);
    }
    this.delWalletDialogVisible = false;
  }

  closeWallet(wallet_id): void {
    this.backend.closeWallet(wallet_id, () => {
      for (let i = this.variablesService.wallets.length - 1; i >= 0; i--) {
        if (this.variablesService.wallets[i].wallet_id === this.variablesService.currentWallet.wallet_id) {
          this.variablesService.wallets.splice(i, 1);
        }
      }
      this.ngZone.run(() => {
        if (this.variablesService.wallets.length) {
          this.variablesService.currentWallet = this.variablesService.wallets[0];
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  updateWalletStatus(): void {
    this.backend.eventSubscribe('wallet_sync_progress', (data) => {
      const wallet_id = data.wallet_id;
      if (wallet_id === this.variablesService.currentWallet.wallet_id) {
        this.ngZone.run(() => {
          this.walletLoaded = false;
        });
      }
    });
    this.backend.eventSubscribe('update_wallet_status', (data) => {
      const wallet_state = data.wallet_state;
      const wallet_id = data.wallet_id;
      this.ngZone.run(() => {
        if (wallet_state === 2 && wallet_id === this.variablesService.currentWallet.wallet_id) {
          this.walletLoaded =
            (this.variablesService.getWallet(this.variablesService.currentWallet.wallet_id) !== null &&
              this.variablesService.getWallet(this.variablesService.currentWallet.wallet_id).loaded);
          if (this.walletLoaded) {
            this.setTabsDisabled(this.variablesService.currentWallet.balance.eq(0));
          }
        } else {
          this.walletLoaded = false;
        }
      });
    });
  }

  setTabsDisabled(disabled: boolean): void {
    this.tabs[1].disabled = disabled;
    this.tabs[3].disabled = disabled;
    this.tabs[4].disabled = disabled;
  }
}
