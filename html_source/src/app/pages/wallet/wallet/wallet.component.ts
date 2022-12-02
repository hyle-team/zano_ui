import {
  Component,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { TranslateService } from '@ngx-translate/core';
import { IntToMoneyPipe } from '@parts/pipes/int-to-money-pipe/int-to-money.pipe';
import { Subject } from 'rxjs';
import { StateKeys, Store, Sync } from '@store/store';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { hasOwnProperty } from '@parts/functions/hasOwnProperty';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import {
  ConfirmModalComponent,
  ConfirmModalData,
} from '@parts/modals/confirm-modal/confirm-modal.component';
import { ExportHistoryModalComponent } from './modals/export-history-modal/export-history-modal.component';
import { AddCustomTokenComponent } from './modals/add-custom-token/add-custom-token.component';

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

  walletSyncVisible = false;

  tabs = [
    {
      title: 'WALLET.TABS.ASSETS',
      icon: 'balance-icon',
      link: '/assets',
      disabled: false,
    },
    {
      title: 'WALLET.TABS.HISTORY',
      icon: 'time-circle',
      link: '/history',
      disabled: false,
    },
    {
      title: 'WALLET.TABS.SEND',
      icon: 'arrow-up-square',
      link: '/send',
      disabled: true,
    },
    {
      title: 'WALLET.TABS.RECEIVE',
      icon: 'arrow-down-square',
      link: '/receive',
      disabled: false,
    },
    {
      title: 'WALLET.TABS.CONTRACTS',
      icon: 'document',
      link: '/contracts',
      disabled: true,
    },
    {
      title: 'WALLET.TABS.STAKING',
      icon: 'staking',
      link: '/staking',
      indicator: false,
      disabled: true,
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
    private store: Store,
    private dialog: Dialog
  ) {
    if (
      !this.variablesService.currentWallet &&
      this.variablesService.wallets.length > 0
    ) {
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

  ngOnInit(): void {
    this.settingsButtonInterval = setInterval(() => {
      // tslint:disable-next-line:triple-equals
      if (this.variablesService.daemon_state == 2 || this.walletLoaded) {
        this.settingsButtonDisabled = false;
        clearInterval(this.settingsButtonInterval);
      }
    }, 1000);
    this.store
      .select(StateKeys.sync)
      .pipe(filter(Boolean), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe({
        next: (value: any) => {
          const data = value.filter(
            (item: Sync) =>
              item.wallet_id === this.variablesService.currentWallet.wallet_id
          )[0];
          if (data && !data.sync) {
            let in_progress;
            const values = this.store.state.sync;
            if (values && values.length > 0) {
              in_progress = values.filter(item => item.sync);
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
        },
      });
    if (hasOwnProperty(this.variablesService.currentWallet.alias, 'name')) {
      this.variablesService.currentWallet.wakeAlias = false;
    }
    this.variablesService.getAliasChangedEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (
            hasOwnProperty(this.variablesService.currentWallet.alias, 'name')
          ) {
            this.variablesService.currentWallet.wakeAlias = false;
          }
        },
      });
    this.updateWalletStatus();
    this.variablesService.getWalletChangedEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.setTabsDisabled(!this.variablesService.currentWallet.balances);
        },
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

  beforeClose(wallet_id): void {
    const dialogConfig: DialogConfig<ConfirmModalData> = {
      data: {
        title: 'WALLET.CONFIRM.MESSAGE',
        message: 'WALLET.CONFIRM.TITLE',
      },
    };

    this.dialog
      .open<boolean>(ConfirmModalComponent, dialogConfig)
      .closed.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: confirmed => confirmed && this.closeWallet(wallet_id),
      });
  }

  addCustomToken(): void {
    this.dialog.open(AddCustomTokenComponent);
  }

  exportHistory(): void {
    this.dialog.open(ExportHistoryModalComponent);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateWalletStatus(): void {
    this.backend.eventSubscribe('wallet_sync_progress', data => {
      const wallet_id = data.wallet_id;
      if (wallet_id === this.variablesService.currentWallet.wallet_id) {
        this.ngZone.run(() => {
          this.walletLoaded = false;
        });
      }
    });
    this.backend.eventSubscribe('update_wallet_status', data => {
      const wallet_state = data.wallet_state;
      const wallet_id = data.wallet_id;
      this.ngZone.run(() => {
        if (
          wallet_state === 2 &&
          wallet_id === this.variablesService.currentWallet.wallet_id
        ) {
          this.walletLoaded =
            this.variablesService.getWallet(
              this.variablesService.currentWallet.wallet_id
            )?.loaded || false;
          if (this.walletLoaded) {
            this.setTabsDisabled(!this.variablesService.currentWallet.balances);
          }
        } else {
          this.walletLoaded = false;
        }
      });
    });
  }

  setTabsDisabled(disabled: boolean): void {
    this.tabs[2].disabled = disabled;
    this.tabs[4].disabled = disabled;
    this.tabs[5].disabled = disabled;
  }
}
