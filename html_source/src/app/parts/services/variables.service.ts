import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Deeplink, Wallet } from '@api/models/wallet.model';
import { Contact } from '@api/models/contact.model';
import { BehaviorSubject, EMPTY, from, mergeMap, Observable, Subject, take, toArray } from 'rxjs';
import { Idle } from 'idlejs/dist';
import { Router } from '@angular/router';
import { ContextMenuComponent, ContextMenuService } from '@perfectmemory/ngx-contextmenu';
import { catchError, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AssetBalance, AssetInfo, VerifiedAssetInfoWhitelist } from '@api/models/assets.model';
import { CurrentPriceForAssets } from '@api/models/api-zano.models';
import { ApiService } from '@api/services/api.service';
import { WrapInfo } from '@api/models/wrap-info';
import { DEFAULT_FEE, DEFAULT_FEE_BIG, DEFAULT_PRICE_ALIAS, MAX_COMMENT_LENGTH, MAX_WALLET_NAME_LENGTH } from '@parts/data/constants';

export interface AppSettings {
    currency: string;
    appLockTime: number;
    appLog: number;
    scale: string;
    appUseTor: boolean;
    visibilityBalance: boolean;
    language: string;
    default_path: string;
    viewedContracts: any[];
    notViewedContracts: any[];
    zanoCompanionForm: {
        zanoCompation: boolean;
        secret: string;
    };
    wallets: any[];
    isDarkTheme: boolean;
    filters: {
        stakingFilters: any;
    };
    localBlacklistsOfVerifiedAssetsByWallets: {
        [key: string]: string[];
    };
}

@Injectable({
    providedIn: 'root',
})
export class VariablesService implements OnDestroy {
    settings: AppSettings = {
        currency: 'usd',
        appLockTime: 15,
        appLog: 0,
        scale: '10px',
        appUseTor: false,
        visibilityBalance: true,
        language: 'en',
        default_path: '/',
        viewedContracts: [],
        notViewedContracts: [],
        zanoCompanionForm: {
            zanoCompation: false,
            secret: '',
        },
        wallets: [],
        isDarkTheme: true,
        filters: {
            stakingFilters: null,
        },
        localBlacklistsOfVerifiedAssetsByWallets: {},
    };

    disable_price_fetch$ = new BehaviorSubject<boolean>(false);

    visibilityBalance$ = new BehaviorSubject<boolean>(this.settings.visibilityBalance);

    zano_current_supply = undefined;

    rpc_port!: number;

    is_remote_node = false;

    use_debug_mode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    info$: BehaviorSubject<any> = new BehaviorSubject<any>({});

    is_hardfok_active$: Observable<boolean> = this.info$.pipe(
        map((info) => {
            return Boolean(info?.['is_hardfok_active']?.[4]);
        }),
        distinctUntilChanged()
    );

    stop_paginate = {};

    sync_started = false;

    decimal_point = 12;

    appPass = '';

    appLogin = false;

    readonly defaultTicker = 'ZANO';

    opening_wallet: Wallet;

    exp_med_ts = 0;

    net_time_delta_median = 0;

    height_app = 0;

    height_max = 0;

    downloaded = 0;

    total = 0;

    last_build_available = '';

    last_build_displaymode = 0;

    daemon_state = 3;

    daemon_state$: BehaviorSubject<number> = new BehaviorSubject<number>(this.daemon_state);

    deeplink$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    // https://docs.zano.org/docs/use/deeplinks/
    deeplinkData$: BehaviorSubject<Deeplink> = new BehaviorSubject<Deeplink>({});

    sync = {
        progress_value: 0,
        progress_value_text: '0',
        blocks: {
            current: 0,
            max: 0,
        },
    };

    public sync_wallets: { [wallet_id: number]: boolean } = {};

    download = {
        progress_value: 0,
        progress_value_text: '0',
    };

    // Avoid of execute function before callback complete
    get_recent_transfers = false;

    default_fee = DEFAULT_FEE;

    default_fee_big = DEFAULT_FEE_BIG;

    default_price_alias = DEFAULT_PRICE_ALIAS;

    isDarkTheme$ = new BehaviorSubject(this.settings.isDarkTheme);

    count = 40;

    maxPages = 5;

    buildVersion: string | null = null;

    testnet = false;

    networkType: 'mainnet' | 'testnet' = 'mainnet';

    wallets: Array<Wallet> = [];

    current_wallet: Wallet;

    currentPriceForAssets: CurrentPriceForAssets = {};

    currentPriceForAssets$: BehaviorSubject<CurrentPriceForAssets> = new BehaviorSubject({});

    maxWalletNameLength: number = MAX_WALLET_NAME_LENGTH;

    maxCommentLength: number = MAX_COMMENT_LENGTH;

    dataIsLoaded = false;

    contacts: Array<Contact> = [];

    pattern = '^[a-zA-Z0-9_.\\]*|~!?@#$%^&+{}()<>:;"\'-=/,[\\\\]*$';

    after_sync_request: any = {};

    getExpMedTsEvent = new BehaviorSubject(null);

    getHeightAppEvent = new BehaviorSubject(null);

    getHeightMaxEvent = new BehaviorSubject(null);

    getDownloadedAppEvent = new BehaviorSubject(null);

    getTotalEvent = new BehaviorSubject(null);

    currentWalletChangedEvent = new BehaviorSubject<Wallet>(null);

    refreshStakingEvent$: Subject<void> = new Subject<void>();

    verifiedAssetInfoWhitelist: VerifiedAssetInfoWhitelist = [];

    get verifiedAssetIdWhitelist(): string[] {
        return this.verifiedAssetInfoWhitelist.map(({ asset_id }: AssetInfo): string => asset_id);
    }

    private _dialog: Dialog = inject(Dialog);

    private _matDialog: MatDialog = inject(MatDialog);

    idle = new Idle().whenNotInteractive().do(async () => {
        if (this.appPass === '') {
            this.stopCountdown();
        } else {
            await this.ngZone.run(async () => {
                this.stopCountdown();
                this.appPass = '';
                this.appLogin = false;
                this._dialog.closeAll();
                this._matDialog.closeAll();
                await this.router.navigate(['/login'], {
                    queryParams: { type: 'auth' },
                });
            });
        }
    });

    allContextMenu: ContextMenuComponent<any>;

    onlyCopyContextMenu: ContextMenuComponent<any>;

    pasteSelectContextMenu: ContextMenuComponent<any>;

    wrap_info$: BehaviorSubject<WrapInfo | null> = new BehaviorSubject<WrapInfo | null>(null);

    is_wrap_info_service_inactive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    private _destroy$: Subject<void> = new Subject<void>();

    constructor(
        private router: Router,
        private ngZone: NgZone,
        private _apiZanoService: ApiService,
        private contextMenuService: ContextMenuService<any>
    ) {
        this.visibilityBalance$.pipe(takeUntil(this._destroy$)).subscribe({
            next: (visibilityBalance) => {
                this.settings.visibilityBalance = visibilityBalance;
            },
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    get hasAppPass(): boolean {
        return Boolean(this.appPass);
    }

    get isCurrentWalletSync(): boolean {
        if (this.current_wallet) {
            const { wallet_id } = this.current_wallet;
            return this.sync_wallets[wallet_id] || false;
        }
        return false;
    }

    get isCurrentWalletLoaded(): boolean {
        if (this.current_wallet) {
            const { loaded } = this.current_wallet;
            return loaded;
        }
        return false;
    }

    get walletNamesForComparisons(): string[] {
        return this.wallets.map(({ name }) => name) ?? [];
    }

    setExpMedTs(timestamp: number): void {
        if (timestamp !== this.exp_med_ts) {
            this.exp_med_ts = timestamp;
            this.getExpMedTsEvent.next(timestamp);
        }
    }

    setHeightApp(height: number): void {
        if (height !== this.height_app) {
            this.height_app = height;
            this.getHeightAppEvent.next(height);
        }
    }

    setHeightMax(height: number): void {
        if (height !== this.height_max) {
            this.height_max = height;
            this.getHeightMaxEvent.next(height);
        }
    }

    setDownloadedBytes(bytes: number): void {
        if (bytes !== this.downloaded) {
            this.downloaded = this.bytesToMb(bytes);
            this.getDownloadedAppEvent.next(bytes);
        }
    }

    setTotalBytes(bytes: number): void {
        if (bytes !== this.total) {
            this.total = this.bytesToMb(bytes);
            this.getTotalEvent.next(bytes);
        }
    }

    setCurrentWallet(id): void {
        this.wallets.forEach((wallet) => {
            if (wallet.wallet_id === id) {
                this.current_wallet = wallet;
                this.currentWalletChangedEvent.next(wallet);
            }
        });
    }

    getWallet(id): Wallet | null {
        for (let i = 0; i < this.wallets.length; i++) {
            if (this.wallets[i].wallet_id === id) {
                return this.wallets[i];
            }
        }
        return null;
    }

    getNotLoadedWallet(): Wallet | null {
        for (let i = 0; i < this.wallets.length; i++) {
            if (!this.wallets[i].loaded) {
                return this.wallets[i];
            }
        }
        return null;
    }

    startCountdown(): void {
        this.idle.within(this.settings.appLockTime).start();
    }

    stopCountdown(): void {
        this.idle.stop();
    }

    restartCountdown(): void {
        if (Boolean(this.settings.appLockTime)) {
            this.idle.within(this.settings.appLockTime).restart();
        } else {
            this.stopCountdown();
        }
    }

    bytesToMb(bytes): number {
        return Number((bytes / Math.pow(1024, 2)).toFixed(1));
    }

    onContextMenu($event: any): void {
        $event.target['contextSelectionStart'] = $event.target['selectionStart'];
        $event.target['contextSelectionEnd'] = $event.target['selectionEnd'];
        if (
            $event.target &&
            ($event.target['nodeName'].toUpperCase() === 'TEXTAREA' || $event.target['nodeName'].toUpperCase() === 'INPUT') &&
            !$event.target['readOnly']
        ) {
            this.contextMenuService.show(this.allContextMenu, {
                x: $event.x,
                y: $event.y,
                value: $event.target,
            });
            $event.preventDefault();
            $event.stopPropagation();
        }
    }

    onContextMenuOnlyCopy($event: any, copyText?: string): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.contextMenuService.show(this.onlyCopyContextMenu, {
            value: copyText,
            x: $event.x,
            y: $event.y,
        });
    }

    onContextMenuPasteSelect($event: any): void {
        $event.target['contextSelectionStart'] = $event.target['selectionStart'];
        $event.target['contextSelectionEnd'] = $event.target['selectionEnd'];

        console.warn($event.target);
        console.warn($event.target['disabled']);

        if (
            $event.target &&
            ($event.target['nodeName'].toUpperCase() === 'TEXTAREA' || $event.target['nodeName'].toUpperCase() === 'INPUT') &&
            !$event.target['readOnly']
        ) {
            this.contextMenuService.show(this.pasteSelectContextMenu, {
                x: $event.x,
                y: $event.y,
                value: $event.target,
            });
            $event.preventDefault();
            $event.stopPropagation();
        }
    }

    loadCurrentPriceForAllAssets(): void {
        const wallets: Wallet[] = this.wallets;

        if (!wallets.length) {
            return;
        }

        const ids = new Set<string>([]);
        wallets.forEach((wallet: Wallet) => {
            const { balances } = wallet;
            balances.forEach((balance: AssetBalance) => {
                const {
                    asset_info: { asset_id },
                } = balance;
                ids.add(asset_id);
            });
        });

        this.loadCurrentPriceForAssetIds(Array.from(ids));
    }

    loadCurrentPriceForAssetIds(ids: string[]): void {
        if (!Array.isArray(ids) || ids.length === 0) {
            return;
        }

        const concurrency = 6;

        from(ids)
            .pipe(
                mergeMap(
                    (asset_id: string) =>
                        this._apiZanoService.getCurrentPriceForAsset(asset_id).pipe(
                            map((resp) => ({ ...resp, asset_id })),
                            catchError(() => EMPTY)
                        ),
                    concurrency
                ),
                toArray(),
                map((results) => {
                    const acc: CurrentPriceForAssets = {};
                    for (const item of results) {
                        if (!item) continue;
                        const { asset_id, data, success } = item as { asset_id: string; data: any; success: boolean };

                        if (!success) continue;
                        if (!data || typeof data !== 'object') continue;

                        const hasUsd = (data as any)?.usd !== undefined;
                        const hasUsd24h = (data as any)?.usd_24h_change !== undefined;
                        if (!hasUsd && !hasUsd24h) continue;

                        if (asset_id) {
                            acc[asset_id] = { data, success };
                        }
                    }
                    return acc;
                }),
                take(1),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (data: CurrentPriceForAssets) => {
                    if (!data || Object.keys(data).length === 0) {
                        return;
                    }
                    const merged: CurrentPriceForAssets = { ...this.currentPriceForAssets, ...data };
                    this.currentPriceForAssets = merged;
                    this.currentPriceForAssets$.next(merged);
                },
            });
    }
}
