import { Component, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { ModalService } from '@parts/services/modal.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Wallet } from '@api/models/wallet.model';
import { TranslateService } from '@ngx-translate/core';
import { IntToMoneyPipe } from '@parts/pipes/int-to-money-pipe/int-to-money.pipe';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import {
  ConfirmModalComponent,
  ConfirmModalData,
} from '@parts/modals/confirm-modal/confirm-modal.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    public variablesService: VariablesService,
    private route: ActivatedRoute,
    private router: Router,
    private backend: BackendService,
    private modal: ModalService,
    private translate: TranslateService,
    private intToMoneyPipe: IntToMoneyPipe,
    private ngZone: NgZone,
    private dialog: Dialog
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  drop(event: CdkDragDrop<Wallet[]>): void {
    moveItemInArray(
      this.variablesService.wallets,
      event.previousIndex,
      event.currentIndex
    );
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
}
