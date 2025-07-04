import { Component, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Wallet } from '@api/models/wallet.model';
import { ConfirmModalComponent, ConfirmModalData } from '@parts/modals/confirm-modal/confirm-modal.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WalletsService } from '@parts/services/wallets.service';
import { ZanoLoadersService } from '@parts/services/zano-loaders.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        public variablesService: VariablesService,
        private walletsService: WalletsService,
        private route: ActivatedRoute,
        private router: Router,
        private ngZone: NgZone,
        private _matDialog: MatDialog,
        public zanoLoadersService: ZanoLoadersService
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    goMainPage(): void {
        if (this.route.snapshot.queryParams && this.route.snapshot.queryParams.prevUrl === 'login') {
            this.ngZone.run(() => {
                this.router.navigate(['/'], { queryParams: { prevUrl: 'login' } });
            });
        } else {
            this.ngZone.run(() => {
                this.router.navigate(['/']);
            });
        }
    }

    selectWallet(event: Event, id: number): void {
        event.preventDefault();
        event.stopPropagation();
        this.ngZone.run(() => {
            this.variablesService.setCurrentWallet(id);
            this.router.navigate(['/wallet/assets']);
        });
    }

    drop(event: CdkDragDrop<Wallet[]>): void {
        moveItemInArray(this.variablesService.wallets, event.previousIndex, event.currentIndex);
    }

    beforeClose(wallet_id): void {
        const config: MatDialogConfig<ConfirmModalData> = {
            data: {
                title: 'WALLET.CONFIRM.MESSAGE',
                message: 'WALLET.CONFIRM.TITLE',
            },
        };

        this._matDialog
            .open<ConfirmModalComponent, ConfirmModalData, boolean>(ConfirmModalComponent, config)
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (confirmed) => confirmed && this.closeWallet(wallet_id),
            });
    }

    closeWallet(wallet_id): void {
        this.walletsService.closeWallet(wallet_id);
    }

    logOut(): void {
        this.zanoLoadersService.open('fullScreen', 'SIDEBAR.SYNCHRONIZATION.LOGGING_OUT');

        setTimeout(() => {
            this.variablesService.stopCountdown();
            this.variablesService.appLogin = false;
            this.variablesService.appPass = '';
            this.ngZone.run(() => {
                this.router.navigate(['/login'], { queryParams: { type: 'auth' } }).then(() => {
                    this.zanoLoadersService.close('fullScreen');
                });
            });
        }, 500);
    }
}
