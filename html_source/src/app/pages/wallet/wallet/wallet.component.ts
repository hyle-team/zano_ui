import { Component, HostListener, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { BackendService, Commands } from '@api/services/backend.service';
import { Observable, Subject, take } from 'rxjs';
import { StateKeys, Store, Sync } from '@store/store';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { hasOwnProperty } from '@parts/functions/has-own-property';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { ConfirmModalComponent, ConfirmModalData } from '@parts/modals/confirm-modal/confirm-modal.component';
import { ExportHistoryModalComponent } from './modals/export-history-modal/export-history-modal.component';
import { AddCustomTokenComponent } from './modals/add-custom-token/add-custom-token.component';
import { AssetBalance } from '@api/models/assets.model';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';
import { WalletsService } from '@parts/services/wallets.service';
import { Wallet } from '@api/models/wallet.model';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { ZARCANUM_MIGRATION } from '@parts/data/constants';
import { MigrateWalletToZarcanumComponent } from './modals/migrate-wallet-to-zarcanum/migrate-wallet-to-zarcanum.component';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { ModalService } from '@parts/services/modal.service';
import { GetBareOutsStats } from '@api/models/rpc.models';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

interface Tab {
    id: string;
    title: string;
    icon: string;
    link: string;
    disabled: boolean;
    hidden: boolean;
    indicator?: boolean;
}

type TabNameKeys = 'assets' | 'history' | 'send' | 'receive' | 'swap' | 'staking' | 'custom-assets';

const objTabs: { [key in TabNameKeys]: Tab } = {
    assets: {
        id: 'assets',
        title: 'WALLET.TABS.ASSETS',
        icon: 'zano-balance',
        link: '/assets',
        disabled: false,
        hidden: false,
    },
    history: {
        id: 'history',
        title: 'WALLET.TABS.HISTORY',
        icon: 'zano-history',
        link: '/history',
        disabled: false,
        hidden: false,
    },
    send: {
        id: 'send',
        title: 'WALLET.TABS.SEND',
        icon: 'zano-send',
        link: '/send',
        disabled: false,
        hidden: false,
    },
    receive: {
        id: 'receive',
        title: 'WALLET.TABS.RECEIVE',
        icon: 'zano-receive',
        link: '/receive',
        disabled: false,
        hidden: false,
    },
    swap: {
        id: 'swap',
        title: 'Swap',
        icon: 'zano-swap',
        link: '/swap',
        disabled: false,
        hidden: true,
    },
    // TODO: https://github.com/hyle-team/zano/issues/374
    // contract: {
    //     title: 'WALLET.TABS.CONTRACTS',
    //     icon: 'document',
    //     link: '/contracts',
    //     disabled: false,
    //     hidden: false
    // },
    staking: {
        id: 'staking',
        title: 'WALLET.TABS.STAKING',
        icon: 'zano-staking',
        link: '/staking',
        indicator: false,
        disabled: false,
        hidden: false,
    },
    'custom-assets': {
        id: 'custom-assets',
        title: 'WALLET.TABS.CONTROL_ASSETS',
        icon: 'zano-custom-asset',
        link: '/custom-assets',
        indicator: false,
        disabled: false,
        hidden: false,
    },
};

@Component({
    selector: 'app-wallet',
    template: `
        <div class="header mb-2" fxFlex="0 0 auto" fxLayout="row nowrap" fxLayoutAlign="space-between start" fxLayoutGap="1rem">
            <div class="left overflow-hidden" fxFlex="1 1 auto" fxLayoutAlign="start center" fxLayout="row nowrap" fxLayoutGap="3rem">
                <div class="wallet-wrapper" fxLayout="column" fxLayoutAlign="start start">
                    <div class="title" fxLayout="row nowrap" fxLayoutAlign="start center">
                        <h1 class="text-ellipsis mr-1">
                            {{ variablesService.currentWallet.address | zanoShortString }}
                        </h1>

                        <app-copy-button
                            [delay]="150"
                            [placement]="'bottom'"
                            [timeout]="0"
                            [tooltipClass]="'table-tooltip'"
                            [tooltip]="variablesService.currentWallet.address"
                            [value]="variablesService.currentWallet.address"
                            class="mr-1"
                        >
                        </app-copy-button>

                        <div
                            *ngIf="!variablesService.currentWallet.is_auditable"
                            class="controls"
                            fxFlex="0 0 auto"
                            fxLayout="row"
                            fxLayoutAlign="start center"
                        >
                            <ng-container
                                *ngIf="
                                    !variablesService.currentWallet.alias.hasOwnProperty('name') &&
                                    variablesService.currentWallet.loaded &&
                                    variablesService.daemon_state === 2 &&
                                    variablesService.currentWallet.alias_available
                                "
                            >
                                <button [routerLink]="['/assign-alias']" class="px-1 py-0_8 btn-light-background">
                                    {{ 'WALLET.REGISTER_ALIAS' | translate }}
                                </button>
                            </ng-container>

                            <ng-container
                                *ngIf="
                                    variablesService.currentWallet.alias.hasOwnProperty('name') &&
                                    variablesService.currentWallet.loaded &&
                                    variablesService.daemon_state === 2
                                "
                            >
                                <div [class.available]="variablesService.currentWallet.alias | isAvailableAliasName" class="alias mr-1">
                                    {{ variablesService.currentWallet.alias.name }}
                                </div>

                                <ng-container *ngIf="variablesService.currentWallet.alias_available">
                                    <button
                                        [delay]="500"
                                        [routerLink]="['/edit-alias']"
                                        [timeDelay]="500"
                                        class="btn-icon circle small mr-1"
                                        placement="bottom-right"
                                        tooltip="{{ 'WALLET.TOOLTIPS.EDIT_ALIAS' | translate }}"
                                        tooltipClass="table-tooltip account-tooltip"
                                    >
                                        <mat-icon svgIcon="zano-edit"></mat-icon>
                                    </button>

                                    <button
                                        [delay]="500"
                                        [routerLink]="['/transfer-alias']"
                                        [timeDelay]="500"
                                        class="btn-icon circle small"
                                        placement="right"
                                        tooltip="{{ 'WALLET.TOOLTIPS.TRANSFER_ALIAS' | translate }}"
                                        tooltipClass="table-tooltip account-tooltip"
                                    >
                                        <mat-icon svgIcon="zano-send"></mat-icon>
                                    </button>
                                </ng-container>
                            </ng-container>
                        </div>
                    </div>
                </div>
                <ng-container *ngIf="!variablesService.currentWallet.is_auditable && !variablesService.currentWallet.is_watch_only">
                    <ng-container *ngIf="variablesService.currentWallet.has_bare_unspent_outputs">
                        <hr fxFlex="0 0 1px" style="height: 3.6rem; border: none; border-right: var(--table-rounded-corners-border)" />
                        <div class="migrate-alert" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="2rem">
                            <button class="btn-migrate" type="button" (click)="openMigrateWalletToZarcanum()">
                                {{ 'WALLET.MIGRATE.BUTTON2' | translate }}
                            </button>

                            <div class="migration-details">
                                <p class="text-wrap">{{ 'WALLET.MIGRATE.TEXT1' | translate }}</p>
                                <p
                                    class="text-align-center cursor-pointer"
                                    fxLayout="row"
                                    fxLayoutAlign="start center"
                                    (click)="openZarcanumMigration()"
                                >
                                    <mat-icon svgIcon="zano-info" class="mr-0_5"></mat-icon>
                                    <span class="color-primary">{{ 'WALLET.MIGRATE.BUTTON1' | translate }}</span>
                                </p>
                            </div>
                        </div>
                    </ng-container>
                </ng-container>
            </div>
            <div class="right" fxFlex fxLayout="row" fxLayoutAlign="end" fxLayoutGap="1rem">
                <button
                    class="btn-icon circle big"
                    (click)="variablesService.visibilityBalance$.next(!variablesService.visibilityBalance$.value)"
                >
                    <mat-icon
                        [svgIcon]="(variablesService.visibilityBalance$ | async) ? 'zano-hide-balance' : 'zano-show-balance'"
                    ></mat-icon>
                </button>
                <div class="dropdown">
                    <button
                        (click)="$event.stopPropagation(); toggleMenuDropdown()"
                        #trigger="cdkOverlayOrigin"
                        cdkOverlayOrigin
                        [disabled]="settingsButtonDisabled && !variablesService.currentWallet.loaded"
                        class="btn-icon circle big"
                        data-target="wallet-dropdown-button"
                    >
                        <mat-icon svgIcon="zano-wallet-settings"></mat-icon>
                    </button>
                </div>
            </div>
        </div>

        <ng-template
            (backdropClick)="$event.stopPropagation(); toggleMenuDropdown()"
            [cdkConnectedOverlayBackdropClass]="'opacity-0'"
            [cdkConnectedOverlayHasBackdrop]="true"
            [cdkConnectedOverlayOrigin]="trigger"
            [cdkConnectedOverlayOpen]="openDropdown"
            [cdkConnectedOverlayPositions]="[
                {
                    originX: 'end',
                    originY: 'top',
                    overlayX: 'end',
                    overlayY: 'top',
                    offsetY: 40
                }
            ]"
            cdkConnectedOverlay
        >
            <div (click)="toggleMenuDropdown()" class="content-bottom-right py-0_5">
                <ul class="list">
                    <li class="item">
                        <button
                            [delay]="500"
                            [disabled]="!variablesService.currentWallet.loaded"
                            [routerLink]="['/details']"
                            [timeDelay]="500"
                            class="w-100 px-2 py-1"
                            placement="left"
                            routerLinkActive="active"
                            tooltip="{{ 'WALLET.TOOLTIPS.SETTINGS' | translate }}"
                            tooltipClass="table-tooltip account-tooltip"
                            type="button"
                        >
                            <mat-icon svgIcon="zano-settings" class="mr-1"></mat-icon>
                            <span>{{ 'WALLET_DETAILS.WALLET_OPTIONS' | translate }}</span>
                        </button>
                    </li>
                    <ng-container *ngIf="variablesService.is_hardfok_active$ | async">
                        <li class="item">
                            <button
                                (click)="addCustomToken()"
                                [delay]="500"
                                [disabled]="false"
                                [timeDelay]="500"
                                class="w-100 px-2 py-1"
                                placement="left"
                                tooltip="{{ 'WALLET.TOOLTIPS.WHITELIST_ASSET' | translate }}"
                                tooltipClass="table-tooltip account-tooltip"
                                type="button"
                            >
                                <mat-icon svgIcon="zano-plus" class="mr-1"></mat-icon>
                                <span>{{ 'WALLET_DETAILS.WHITELIST_ASSET' | translate }}</span>
                            </button>
                        </li>
                    </ng-container>
                    <li class="item">
                        <button
                            (click)="exportHistory()"
                            [delay]="500"
                            [disabled]="variablesService.currentWallet.history.length <= 0"
                            [timeDelay]="500"
                            class="w-100 px-2 py-1"
                            placement="left"
                            tooltip="{{ 'EXPORT_HISTORY.TOOLTIP' | translate }}"
                            tooltipClass="table-tooltip account-tooltip"
                            type="button"
                        >
                            <mat-icon svgIcon="zano-export" class="mr-1"></mat-icon>
                            <span>{{ 'EXPORT_HISTORY.EXPORT_BUTTON' | translate }}</span>
                        </button>
                    </li>
                    <ng-container *ngIf="walletSyncVisible">
                        <li class="item">
                            <button
                                (click)="resyncCurrentWallet(variablesService.currentWallet.wallet_id)"
                                [delay]="500"
                                [disabled]="!variablesService.currentWallet.loaded"
                                [timeDelay]="500"
                                class="w-100 px-2 py-1"
                                placement="left"
                                tooltip="{{ 'WALLET_DETAILS.RESYNC_WALLET' | translate }}"
                                tooltipClass="table-tooltip account-tooltip"
                                type="button"
                            >
                                <mat-icon svgIcon="zano-update" class="mr-1"></mat-icon>
                                <span>{{ 'WALLET_DETAILS.RESYNC_WALLET_BUTTON' | translate }}</span>
                            </button>
                        </li>
                    </ng-container>
                    <li class="item">
                        <button
                            (click)="close(variablesService.currentWallet.wallet_id)"
                            [delay]="500"
                            [timeDelay]="500"
                            class="w-100 px-2 py-1"
                            placement="left"
                            tooltip="{{ 'WALLET.TOOLTIPS.REMOVE' | translate }}"
                            tooltipClass="table-tooltip account-tooltip"
                            type="button"
                        >
                            <mat-icon svgIcon="zano-close-v2" class="mr-1"></mat-icon>
                            <span>{{ 'WALLET_DETAILS.BUTTON_REMOVE' | translate }}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </ng-template>

        <div class="tabs">
            <div class="tabs-header">
                <ng-container *ngFor="let tab of tabs">
                    <ng-container *ngIf="!tab.hidden">
                        <button
                            [disabled]="tab.disabled"
                            [routerLink]="['/wallet' + tab.link]"
                            class="tab-header"
                            routerLinkActive="active"
                        >
                            <mat-icon [svgIcon]="tab.icon"></mat-icon>
                            <span *ngIf="isViewTabName$ | async" class="ml-1">{{ tab.title | translate }}</span>
                            <span *ngIf="tab.indicator" class="indicator">{{ variablesService.currentWallet.new_contracts }}</span>
                        </button>
                    </ng-container>
                </ng-container>
            </div>
            <div class="tabs-content">
                <router-outlet></router-outlet>

                <div *ngIf="loader" class="wrapper-tab-preloader">
                    <div class="preloader">
                        <p class="mb-2">
                            {{ 'Loading...' | translate }}
                        </p>
                        <div class="loading-bar"></div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class WalletComponent implements OnInit, OnDestroy {
    settingsButtonInterval;

    private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

    isViewTabName$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 1400px)']).pipe(map(({ matches }) => matches));

    settingsButtonDisabled = true;

    walletLoaded = false;

    openDropdown: boolean;

    walletSyncVisible = false;

    tabs: Tab[] = [];

    private destroy$ = new Subject<void>();

    loader = true;

    private readonly _matDialog: MatDialog = inject(MatDialog);

    constructor(
        private backend: BackendService,
        public variablesService: VariablesService,
        private ngZone: NgZone,
        private store: Store,
        private dialog: Dialog,
        private modalService: ModalService,
        private walletsService: WalletsService,
        private router: Router
    ) {

        if (!this.variablesService.currentWallet && this.variablesService.wallets.length > 0) {
            this.variablesService.setCurrentWallet(0);
        }
        this.walletLoaded = this.variablesService.currentWallet.loaded;

        this.variablesService.currentWalletChangedEvent.pipe(takeUntil(this.destroy$)).subscribe({
            next: (wallet: Wallet) => {
                this.createTabs(wallet);
                const disabled = !wallet.loaded;
                this.setDisabledTabs(['send', 'swap', 'staking', 'custom-assets'], disabled);

                this.variablesService.is_hardfok_active$.pipe(take(1)).subscribe({
                    next: value => {
                        const hidden = !value;
                        this.setHiddenTabs(['swap'], hidden);
                    },
                });
            },
        });

        this.variablesService.is_hardfok_active$.pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                const hidden = !value;
                this.setHiddenTabs(['swap'], hidden);
            },
        });

        this.router.events.pipe(takeUntil(this.destroy$)).subscribe((e: RouterEvent) => {
            this.navigationInterceptor(e);
        });
    }

    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.loader = true;
        }
        if (event instanceof NavigationEnd) {
            setTimeout(() => {
                this.loader = false;
            }, 500);
        }
        if (event instanceof NavigationCancel) {
            setTimeout(() => {
                this.loader = false;
            }, 500);
        }
        if (event instanceof NavigationError) {
            setTimeout(() => {
                this.loader = false;
            }, 500);
        }
    }

    createTabs({ is_auditable, is_watch_only }: Wallet): void {
        const conditionForHiding: boolean = !is_auditable || !is_watch_only;
        const tabs: Array<Tab> = [];

        tabs.push(objTabs.assets);
        tabs.push(objTabs.history);

        if (conditionForHiding) {
            tabs.push(objTabs.send);
        }

        tabs.push(objTabs.receive);

        if (conditionForHiding) {
            tabs.push(objTabs.swap);
        }

        tabs.push(objTabs.staking);

        if (conditionForHiding) {
            tabs.push(objTabs['custom-assets']);
        }

        this.tabs = tabs;
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
                    const data = value.filter((item: Sync) => item.wallet_id === this.variablesService.currentWallet.wallet_id)[0];
                    if (data && !data.sync) {
                        let in_progress;
                        const values = this.store.state.sync;
                        if (values && values.length > 0) {
                            in_progress = values.filter(item => item.sync);
                            this.variablesService.sync_started = !!(in_progress && in_progress.length);
                            if (!in_progress) {
                                this.variablesService.sync_started = false;
                                this.variablesService.sync_wallets[data.wallet_id] = false;
                            }
                        } else {
                            this.variablesService.sync_started = false;
                            this.variablesService.sync_wallets[data.wallet_id] = false;
                        }
                    }
                },
            });
        if (hasOwnProperty(this.variablesService.currentWallet.alias, 'name')) {
            this.variablesService.currentWallet.wakeAlias = false;
        }
        this.variablesService.getAliasChangedEvent.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                if (hasOwnProperty(this.variablesService.currentWallet.alias, 'name')) {
                    this.variablesService.currentWallet.wakeAlias = false;
                }
            },
        });
        this.updateWalletStatus();
    }

    toggleMenuDropdown(): void {
        if (!this.openDropdown) {
            this.openDropdown = true;
        } else {
            this.openDropdown = false;
            this.walletSyncVisible = false;
        }
    }

    resyncCurrentWallet(wallet_id: number): void {
        this.backend.resyncWallet(wallet_id);
    }

    close(wallet_id: number): void {
        const config: MatDialogConfig<ConfirmModalData> = {
            data: {
                title: 'WALLET.CONFIRM.MESSAGE',
                message: 'WALLET.CONFIRM.TITLE',
            },
        };

        this._matDialog
            .open<ConfirmModalComponent, ConfirmModalData, boolean>(ConfirmModalComponent, config)
            .afterClosed().pipe(filter(Boolean), takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.walletsService.closeWallet(wallet_id);
                },
            });
    }

    addCustomToken(): void {
        this._matDialog
            .open<AddCustomTokenComponent, void, AssetBalance | undefined>(AddCustomTokenComponent)
            .afterClosed().pipe(
                filter(response_data => Boolean(response_data)),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: asset => {
                    const config: MatDialogConfig = {
                        data: {
                            assetInfo: asset.asset_info,
                            title: 'You added new asset',
                        },
                    };
                    this.ngZone.run(() => {
                        this._matDialog.open(AssetDetailsComponent, config);
                    });
                },
            });
    }

    exportHistory(): void {
        this._matDialog.open(ExportHistoryModalComponent);
    }

    openZarcanumMigration(): void {
        this.backend.openUrlInBrowser(ZARCANUM_MIGRATION);
    }

    openMigrateWalletToZarcanum(): void {
        const {
            currentWallet: { wallet_id },
        } = this.variablesService;
        const params: ParamsCallRpc = {
            id: 0,
            jsonrpc: '2.0',
            method: 'get_bare_outs_stats',
            params: {},
        };
        this.backend.call_wallet_rpc([wallet_id, params], (status, response_data) => {
            this.ngZone.run(() => {
                if (response_data?.result) {
                    const data = response_data.result;

                    const config: MatDialogConfig<GetBareOutsStats> = {
                        data,
                        disableClose: false
                    };
                    this._matDialog.open(MigrateWalletToZarcanumComponent, config);
                } else {
                    const message = response_data.error;
                    this.modalService.prepareModal('error', message);
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateWalletStatus(): void {
        this.backend.eventSubscribe(Commands.wallet_sync_progress, data => {
            const wallet_id = data.wallet_id;
            if (wallet_id === this.variablesService.currentWallet.wallet_id) {
                this.ngZone.run(() => {
                    this.walletLoaded = false;
                });
            }
        });
        this.backend.eventSubscribe(Commands.update_wallet_status, data => {
            const wallet_state = data.wallet_state;
            const wallet_id = data.wallet_id;
            this.ngZone.run(() => {
                if (wallet_id !== this.variablesService.currentWallet.wallet_id) {
                    return;
                }

                if (wallet_state === 2) {
                    this.walletLoaded = true;
                    this.setDisabledTabs(['send', 'swap', 'staking', 'custom-assets'], false);
                } else {
                    this.walletLoaded = false;
                    this.setDisabledTabs(['send', 'swap', 'staking', 'custom-assets'], true);
                }
            });
        });
    }

    setHiddenTabs(ids: string[], hidden: boolean): void {
        this.tabs.forEach(tab => {
            if (ids.includes(tab.id)) {
                tab.hidden = hidden;
            }
        });
    }

    setDisabledTabs(ids: string[], disabled: boolean): void {
        this.tabs.forEach(tab => {
            if (ids.includes(tab.id)) {
                tab.disabled = disabled;
            }
        });
    }
}
