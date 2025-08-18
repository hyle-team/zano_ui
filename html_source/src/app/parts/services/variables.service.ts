import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { DeeplinkParams, Wallet } from '@api/models/wallet.model';
import { Contact } from '@api/models/contact.model';
import { BehaviorSubject, concatMap, from, Observable, scan, Subject } from 'rxjs';
import { Idle } from 'idlejs/dist';
import { Router } from '@angular/router';
import { ContextMenuComponent, ContextMenuService } from '@perfectmemory/ngx-contextmenu';
import { BigNumber } from 'bignumber.js';
import { AliasInfoList } from '@api/models/alias.model';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AssetBalance, AssetInfo, VerifiedAssetInfoWhitelist } from '@api/models/assets.model';
import { CurrentPriceForAssets } from '@api/models/api-zano.models';
import { ApiService } from '@api/services/api.service';
import { WrapInfo } from '@api/models/wrap-info';
import { MAX_COMMENT_LENGTH, MAX_WALLET_NAME_LENGTH } from '@parts/data/constants';

@Injectable({
    providedIn: 'root',
})
export class VariablesService implements OnDestroy {
    readonly currenciesItems = [
        { label: 'SOL', id: 'sol' },
        { label: 'USD', id: 'usd' },
        { label: 'AED', id: 'aed' },
        { label: 'ARS', id: 'ars' },
        { label: 'AUD', id: 'aud' },
        { label: 'BDT', id: 'bdt' },
        { label: 'BHD', id: 'bhd' },
        { label: 'BMD', id: 'bmd' },
        { label: 'BRL', id: 'brl' },
        { label: 'CAD', id: 'cad' },
        { label: 'CHF', id: 'chf' },
        { label: 'CLP', id: 'clp' },
        { label: 'CNY', id: 'cny' },
        { label: 'CZK', id: 'czk' },
        { label: 'DKK', id: 'dkk' },
        { label: 'EUR', id: 'eur' },
        { label: 'GBP', id: 'gbp' },
        { label: 'GEL', id: 'gel' },
        { label: 'HKD', id: 'hkd' },
        { label: 'HUF', id: 'huf' },
        { label: 'IDR', id: 'idr' },
        { label: 'ILS', id: 'ils' },
        { label: 'INR', id: 'inr' },
        { label: 'JPY', id: 'jpy' },
        { label: 'KRW', id: 'krw' },
        { label: 'KWD', id: 'kwd' },
        { label: 'LKR', id: 'lkr' },
        { label: 'MMK', id: 'mmk' },
        { label: 'MXN', id: 'mxn' },
        { label: 'MYR', id: 'myr' },
        { label: 'NGN', id: 'ngn' },
        { label: 'NOK', id: 'nok' },
        { label: 'NZD', id: 'nzd' },
        { label: 'PHP', id: 'php' },
        { label: 'PKR', id: 'pkr' },
        { label: 'PLN', id: 'pln' },
        { label: 'RUB', id: 'rub' },
        { label: 'SAR', id: 'sar' },
        { label: 'SEK', id: 'sek' },
        { label: 'SGD', id: 'sgd' },
        { label: 'THB', id: 'thb' },
        { label: 'TRY', id: 'try' },
        { label: 'TWD', id: 'twd' },
        { label: 'UAH', id: 'uah' },
        { label: 'VEF', id: 'vef' },
        { label: 'VND', id: 'vnd' },
        { label: 'ZAR', id: 'zar' },
        { label: 'XDR', id: 'xdr' },
        { label: 'XAG', id: 'xag' },
        { label: 'XAU', id: 'xau' },
        { label: 'BITS', id: 'bits' },
        { label: 'SATS', id: 'sats' },
    ];

    readonly fiatCurrencyIds = new Set([
        'usd','aed','ars','aud','bdt','bhd','bmd','brl','cad','chf','clp','cny','czk',
        'dkk','eur','gbp','gel','hkd','huf','idr','ils','inr','jpy','krw','kwd','lkr',
        'mmk','mxn','myr','ngn','nok','nzd','php','pkr','pln','rub','sar','sek','sgd',
        'thb','try','twd','uah','vef','vnd','zar','xdr'
    ]);

    readonly fiatCurrencies = this.currenciesItems.filter(c => this.fiatCurrencyIds.has(c.id));

    readonly nonFiatCurrencies = this.currenciesItems.filter(c => !this.fiatCurrencyIds.has(c.id));

    isFiatCurrency = (currency: string) => this.fiatCurrencyIds.has(currency);

    disable_price_fetch$ = new BehaviorSubject<boolean>(false);

    visibilityBalance$ = new BehaviorSubject<boolean>(true);

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
    get_recent_transfers = false;

    default_fee = '0.01';

    default_fee_big: BigNumber = new BigNumber('10000000000');

    // (0.1 + fee) = 0.11 ZANO
    default_price_alias: BigNumber = BigNumber.sum('100000000000', this.default_fee_big);

    settings = {
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

    isDarkTheme$ = new BehaviorSubject(true);

    count = 40;

    maxPages = 5;

    buildVersion: string | null = null;

    testnet = false;

    networkType: 'mainnet' | 'testnet' = 'mainnet';

    wallets: Array<Wallet> = [];

    current_wallet: Wallet;

    currentPriceForAssets: CurrentPriceForAssets = {};

    currentPriceForAssets$: BehaviorSubject<CurrentPriceForAssets> = new BehaviorSubject({});

    all_aliases: AliasInfoList = [];

    all_aliases_loaded = false;

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

        wallets.forEach((wallet: Wallet) => {
            const { balances } = wallet;
            this.loadCurrentPriceForAssets(balances);
        });
    }

    loadCurrentPriceForAssets(balances: AssetBalance[]): void {
        const observables = balances.map(({ asset_info: { asset_id } }: AssetBalance) =>
            this._apiZanoService.getCurrentPriceForAsset(asset_id)
        );

        from(observables)
            .pipe(
                concatMap((observable) => observable),
                filter(({ success }) => success),
                scan((acc, value) => {
                    const { asset_id, data, success } = value;

                    if (!success) {
                        return acc;
                    }

                    if (typeof data === 'object' && data.usd === undefined && data.usd_24h_change === undefined) {
                        return acc;
                    }

                    return { ...acc, [asset_id]: { data, success } };
                }, <CurrentPriceForAssets>{})
            )
            .subscribe({
                next: (currentPriceForAssets: CurrentPriceForAssets) => {
                    const prevCurrentPriceForAssets: CurrentPriceForAssets = this.currentPriceForAssets;
                    const newCurrentPriceForAssets = { ...prevCurrentPriceForAssets, ...currentPriceForAssets };

                    this.currentPriceForAssets = newCurrentPriceForAssets;
                    this.currentPriceForAssets$.next(newCurrentPriceForAssets);
                },
            });
    }
}
