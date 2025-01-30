import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { DeeplinkParams, Wallet } from '@api/models/wallet.model';
import { Contact } from '@api/models/contact.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Idle } from 'idlejs/dist';
import { Router } from '@angular/router';
import { ContextMenuComponent, ContextMenuService } from '@perfectmemory/ngx-contextmenu';
import { BigNumber } from 'bignumber.js';
import { Aliases } from '@api/models/alias.model';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AssetInfo, VerifiedAssetInfoWhitelist } from '@api/models/assets.model';

@Injectable({
    providedIn: 'root',
})
export class VariablesService implements OnDestroy {
    disable_price_fetch$ = new BehaviorSubject<boolean>(false);

    visibilityBalance$ = new BehaviorSubject<boolean>(true);

    zano_current_supply = undefined;

    rpc_port!: number;

    is_remote_node = false;

    use_debug_mode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    info$: BehaviorSubject<any> = new BehaviorSubject<any>({});

    is_hardfok_active$: Observable<boolean> = this.info$.pipe(
        map(info => {
            return Boolean(info?.['is_hardfok_active']?.[4]);
        }),
        distinctUntilChanged()
    );

    stop_paginate = {};

    sync_started: boolean = false;

    decimal_point: number = 12;

    appPass: string = '';

    // \(2^{64}-1\) => (18,446,744,073,709,551,615)
    maximum_value: BigNumber = new BigNumber('18446744073709551615');

    appLogin: boolean = false;

    zanoMoneyEquivalent: number = 0;

    zanoMoneyEquivalentPercent: number = 0;

    defaultTicker: 'ZANO' = 'ZANO';

    opening_wallet: Wallet;

    exp_med_ts: number = 0;

    net_time_delta_median: number = 0;

    height_app: number = 0;

    height_max: number = 0;

    downloaded: number = 0;

    total: number = 0;

    last_build_available: string = '';

    last_build_displaymode: number = 0;

    daemon_state: number = 3;

    daemon_state$: BehaviorSubject<number> = new BehaviorSubject<number>(this.daemon_state);

    deeplink$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    sendActionData$: BehaviorSubject<DeeplinkParams> = new BehaviorSubject<DeeplinkParams>({});

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
    get_recent_transfers: boolean = false;

    default_fee: string = '0.010000000000';

    default_fee_big: BigNumber = new BigNumber('10000000000');

    settings = {
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
        localBlacklistsOfVerifiedAssetsByWallets: {}
    };

    isDarkTheme$ = new BehaviorSubject(true);

    count: number = 40;

    maxPages: number = 5;

    testnet: boolean = false;

    networkType: 'mainnet' | 'testnet' = 'mainnet';

    wallets: Array<Wallet> = [];

    currentWallet: Wallet;

    aliases: Aliases = [];

    aliasesChecked: any = {};

    enableAliasSearch: boolean = false;

    maxWalletNameLength: number = 25;

    maxCommentLength: number = 255;

    dataIsLoaded: boolean = false;

    contacts: Array<Contact> = [];

    pattern: string = '^[a-zA-Z0-9_.\\]*|~!?@#$%^&+{}()<>:;"\'-=/,[\\\\]*$';

    after_sync_request: any = {};

    getExpMedTsEvent = new BehaviorSubject(null);

    getHeightAppEvent = new BehaviorSubject(null);

    getHeightMaxEvent = new BehaviorSubject(null);

    getDownloadedAppEvent = new BehaviorSubject(null);

    getTotalEvent = new BehaviorSubject(null);

    getAliasChangedEvent = new BehaviorSubject(null);

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

    private _destroy$: Subject<void> = new Subject<void>();

    constructor(private router: Router, private ngZone: NgZone, private contextMenuService: ContextMenuService<any>) {
        this.visibilityBalance$.pipe(takeUntil(this._destroy$)).subscribe({
            next: visibilityBalance => {
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
        if (this.currentWallet) {
            const { wallet_id } = this.currentWallet;
            return this.sync_wallets[wallet_id] || false;
        }
        return false;
    }

    get isCurrentWalletLoaded(): boolean {
        if (this.currentWallet) {
            const { loaded } = this.currentWallet;
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

    changeAliases(): void {
        this.getAliasChangedEvent.next(true);
    }

    setCurrentWallet(id): void {
        this.wallets.forEach(wallet => {
            if (wallet.wallet_id === id) {
                this.currentWallet = wallet;
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
}
