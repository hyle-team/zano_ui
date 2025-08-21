import { Component, HostListener, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { BackendService, Commands } from '@api/services/backend.service';
import { Observable, Subject, take } from 'rxjs';
import { StateKeys, Store, Sync } from '@store/store';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { ConfirmModalComponent, ConfirmModalData } from '@parts/modals/confirm-modal/confirm-modal.component';
import { ExportHistoryModalComponent } from './dialogs/export-history-modal/export-history-modal.component';
import { AddCustomTokenComponent } from './dialogs/add-custom-token/add-custom-token.component';
import { AssetBalance } from '@api/models/assets.model';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';
import { WalletsService } from '@parts/services/wallets.service';
import { Wallet } from '@api/models/wallet.model';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
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
        title: 'WALLET.TABS.P2P_SWAP',
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
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit, OnDestroy {
    settingsButtonInterval;

    private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

    isViewTabName$: Observable<boolean> = this.breakpointObserver.observe(['(min-width: 1400px)']).pipe(map(({ matches }) => matches));

    settingsButtonDisabled = true;

    walletLoaded = false;

    walletSyncVisible = false;

    tabs: Tab[] = [];

    private destroy$ = new Subject<void>();

    loader = true;

    private readonly _matDialog: MatDialog = inject(MatDialog);

    get isShowMigrateAlert(): boolean {
        const { current_wallet, daemon_state } = this.variablesService;

        if (!current_wallet) {
            return false;
        }

        const { is_auditable, is_watch_only, has_bare_unspent_outputs, loaded } = current_wallet;

        return !is_auditable && !is_watch_only && loaded && daemon_state === 2 && has_bare_unspent_outputs;
    }

    constructor(
        private backend: BackendService,
        public variablesService: VariablesService,
        private ngZone: NgZone,
        private store: Store,
        private walletsService: WalletsService,
        private router: Router
    ) {
        if (!this.variablesService.current_wallet && this.variablesService.wallets.length > 0) {
            this.variablesService.setCurrentWallet(0);
        }
        this.walletLoaded = this.variablesService.current_wallet.loaded;

        this.variablesService.currentWalletChangedEvent.pipe(takeUntil(this.destroy$)).subscribe({
            next: (wallet: Wallet) => {
                this.createTabs(wallet);
                const disabled = !wallet.loaded;
                this.setDisabledTabs(['send', 'swap', 'staking', 'custom-assets'], disabled);

                this.variablesService.is_hardfok_active$.pipe(take(1)).subscribe({
                    next: (value) => {
                        const hidden = !value;
                        this.setHiddenTabs(['swap'], hidden);
                    },
                });
            },
        });

        this.variablesService.is_hardfok_active$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (value) => {
                const hidden = !value;
                this.setHiddenTabs(['swap'], hidden);
            },
        });
    }

    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.loader = true;
        }
        if (event instanceof NavigationEnd) {
            this.loader = false;
        }
        if (event instanceof NavigationCancel) {
            this.loader = false;
        }
        if (event instanceof NavigationError) {
            this.loader = false;
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
        this.walletSyncVisible = true;
    }

    @HostListener('document:keyup.shift', ['$event.key'])
    onKeyUpPressed(): void {
        this.walletSyncVisible = false;
    }

    ngOnInit(): void {
        this.settingsButtonInterval = setInterval(() => {
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
                    const data = value.filter((item: Sync) => item.wallet_id === this.variablesService.current_wallet.wallet_id)[0];
                    if (data && !data.sync) {
                        let in_progress;
                        const values = this.store.state.sync;
                        if (values && values.length > 0) {
                            in_progress = values.filter((item) => item.sync);
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
        this.updateWalletStatus();

        this.loader = false;
        this.router.events.pipe(takeUntil(this.destroy$)).subscribe((e: RouterEvent) => {
            this.navigationInterceptor(e);
        });
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
            .afterClosed()
            .pipe(filter(Boolean), takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.walletsService.closeWallet(wallet_id);
                },
            });
    }

    addCustomToken(): void {
        this._matDialog
            .open<AddCustomTokenComponent, void, AssetBalance | undefined>(AddCustomTokenComponent)
            .afterClosed()
            .pipe(
                filter((response_data) => Boolean(response_data)),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (asset) => {
                    const config: MatDialogConfig = {
                        data: {
                            asset_info: asset.asset_info,
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateWalletStatus(): void {
        this.backend.eventSubscribe(Commands.wallet_sync_progress, (data) => {
            const wallet_id = data.wallet_id;
            if (wallet_id === this.variablesService.current_wallet.wallet_id) {
                this.ngZone.run(() => {
                    this.walletLoaded = false;
                });
            }
        });
        this.backend.eventSubscribe(Commands.update_wallet_status, (data) => {
            const wallet_state = data.wallet_state;
            const wallet_id = data.wallet_id;
            this.ngZone.run(() => {
                if (wallet_id !== this.variablesService.current_wallet.wallet_id) {
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
        this.tabs.forEach((tab) => {
            if (ids.includes(tab.id)) {
                tab.hidden = hidden;
            }
        });
    }

    setDisabledTabs(ids: string[], disabled: boolean): void {
        this.tabs.forEach((tab) => {
            if (ids.includes(tab.id)) {
                tab.disabled = disabled;
            }
        });
    }
}
