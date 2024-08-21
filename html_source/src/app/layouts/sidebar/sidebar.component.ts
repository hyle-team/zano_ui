import { Component, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Wallet } from '@api/models/wallet.model';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { ConfirmModalComponent, ConfirmModalData } from '@parts/modals/confirm-modal/confirm-modal.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WalletsService } from '@parts/services/wallets.service';
import { ZanoLoadersService } from '@parts/services/zano-loaders.service';
import { BackendService } from '@api/services/backend.service';

@Component({
    selector: 'app-sidebar',
    template: `
        <div class="sidebar-header mb-2">
            <div class="logo">
                <img alt="zano-logo" [src]="zanoLogo" />
            </div>
        </div>

        <div class="sidebar-content">
            <div (cdkDropListDropped)="drop($event)" cdkDropList cdkDropListLockAxis="y" class="sidebar-content-list scrolled-content mb-1">
                <app-wallet-card
                    *ngFor="let wallet of variablesService.wallets"
                    [cdkDragData]="wallet"
                    [ngClass]="{
                        active: wallet?.wallet_id === variablesService?.currentWallet?.wallet_id,
                        auditable: wallet.is_auditable && !wallet.is_watch_only,
                        'watch-only': wallet.is_watch_only
                    }"
                    [wallet]="wallet"
                    (click)="selectWallet(wallet.wallet_id)"
                    (eventClose)="beforeClose($event)"
                    cdkDrag
                ></app-wallet-card>
            </div>

            <div class="sidebar-nav scrolled-content">
                <button
                    (click)="goMainPage()"
                    class="outline small w-100 mb-1 px-2"
                    fxLayout="row inline wrap"
                    fxLayoutAlign="start center"
                >
                    <mat-icon svgIcon="zano-plus" class="mr-1"></mat-icon>
                    <span>{{ 'SIDEBAR.ADD_NEW' | translate }}</span>
                </button>

                <button
                    [routerLink]="['/settings']"
                    class="outline small w-100 mb-1 px-2"
                    fxLayout="row inline wrap"
                    fxLayoutAlign="start center"
                    routerLinkActive="active"
                >
                    <mat-icon svgIcon="zano-settings" class="mr-1"></mat-icon>
                    <span>{{ 'SIDEBAR.SETTINGS' | translate }}</span>
                </button>

                <ng-container *ngIf="variablesService.appPass === ''; else masterPass">
                    <button
                        (click)="logOut()"
                        [delay]="500"
                        [disabled]="variablesService.appPass === ''"
                        [timeDelay]="500"
                        class="outline small w-100 px-2"
                        fxLayout="row inline wrap"
                        fxLayoutAlign="start center"
                        placement="bottom"
                        tooltip="{{ 'SIDEBAR.LOG_OUT_TOOLTIP' | translate }}"
                        tooltipClass="table-tooltip account-tooltip"
                    >
                        <mat-icon svgIcon="zano-logout" class="mr-1"></mat-icon>
                        <span>{{ 'SIDEBAR.LOG_OUT' | translate }}</span>
                    </button>
                </ng-container>

                <ng-template #masterPass>
                    <button (click)="logOut()" class="outline small w-100 px-2" fxLayout="row inline wrap" fxLayoutAlign="start center">
                        <mat-icon svgIcon="zano-logout" class="mr-1"></mat-icon>
                        <span> {{ 'SIDEBAR.LOG_OUT' | translate }}</span>
                    </button>
                </ng-template>
            </div>
        </div>

        <div class="sidebar-footer">
            <app-synchronization-status></app-synchronization-status>
        </div>

        <app-deeplink></app-deeplink>
    `,
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnDestroy {
    get zanoLogo(): string {
        const {
            settings: { isDarkTheme },
        } = this.variablesService;
        return isDarkTheme ? 'assets/icons/blue/zano-logo.svg' : 'assets/icons/blue/light-zano-logo.svg';
    }

    private destroy$ = new Subject<void>();

    constructor(
        public variablesService: VariablesService,
        private walletsService: WalletsService,
        private route: ActivatedRoute,
        private router: Router,
        private ngZone: NgZone,
        private dialog: Dialog,
        private backend: BackendService,
        public zanoLoadersService: ZanoLoadersService
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleDarkTheme(): void {
        const { settings, isDarkTheme$ } = this.variablesService;
        const isDarkTheme: boolean = !settings.isDarkTheme;
        this.variablesService.settings.isDarkTheme = isDarkTheme;
        isDarkTheme$.next(isDarkTheme);

        this.backend.storeAppData();
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

    selectWallet(id: number): void {
        this.ngZone.run(() => {
            this.variablesService.setCurrentWallet(id);
            this.router.navigate(['/wallet/assets']);
        });
    }

    drop(event: CdkDragDrop<Wallet[]>): void {
        moveItemInArray(this.variablesService.wallets, event.previousIndex, event.currentIndex);
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
