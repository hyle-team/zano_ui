import { Contracts } from './contract.model';
import { Transaction, Transactions } from './transaction.model';
import { BigNumber } from 'bignumber.js';
import {
    AssetBalance,
    AssetBalances,
    AssetInfo,
    AssetsInfoWhitelist,
    LocalBlacklistVerifiedAssets,
    VerifiedAssetInfoWhitelist,
} from './assets.model';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { AliasInfo, AliasInfoList } from '@api/models/alias.model';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { map } from 'rxjs/operators';
import { DEFAULT_ASSET_LOGO_SRC } from '@parts/data/constants';
import { CurrentPriceForAssets } from '@api/models/api-zano.models';
import { getFiatValue } from '@parts/functions/get-fiat-value';
import { TransferFormValue } from '../../pages/wallet/tabs/send/send.component';

export const DEFAULT_ASSETS_INFO_WHITELIST: AssetsInfoWhitelist = { global_whitelist: [], local_whitelist: [], own_assets: [] };

const DEFAULT_BALANCES: AssetBalances = [
    {
        asset_info: ZANO_ASSET_INFO,
        awaiting_in: 0,
        awaiting_out: 0,
        total: 0,
        unlocked: 0,
    },
];

const sortBalances = (
    value: AssetBalances | null | undefined,
    verifiedAssetInfoWhitelist: VerifiedAssetInfoWhitelist,
    currentPriceForAssets: CurrentPriceForAssets,
    walletSettings: WalletSettings,
    currency = 'usd'
): AssetBalances => {
    if (!value?.length) return [];

    const verifiedIds: Set<string> = new Set(verifiedAssetInfoWhitelist.map((v) => v.asset_id));

    const filtered: AssetBalances = walletSettings.hideEmptyAssets
        ? value.filter(({ asset_info: { asset_id }, total }) => asset_id === ZANO_ASSET_INFO.asset_id || total > 0)
        : value;

    const prepared = filtered.map((balance) => {
        const fiatValue = getFiatValue(balance, currentPriceForAssets, currency);
        const fiatBn = fiatValue === null ? new BigNumber(0) : new BigNumber(fiatValue);
        const fiat = fiatBn.isFinite() && !fiatBn.isNaN() ? fiatBn : new BigNumber(0);

        const totalBn = new BigNumber(balance.total ?? 0);
        const total = totalBn.isFinite() && !totalBn.isNaN() ? totalBn : new BigNumber(0);

        return {
            balance,
            isZano: balance.asset_info.asset_id === ZANO_ASSET_INFO.asset_id,
            isVerified: verifiedIds.has(balance.asset_info.asset_id),
            fiat,
            total,
            ticker: balance.asset_info?.ticker ?? '',
        };
    });

    prepared.sort((a, b) => {
        if (a.isZano !== b.isZano) return a.isZano ? -1 : 1;
        if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;

        const byFiat = b.fiat.comparedTo(a.fiat);
        if (byFiat !== 0) return byFiat;

        const byTotal = b.total.comparedTo(a.total);
        if (byTotal !== 0) return byTotal;

        return a.ticker.localeCompare(b.ticker);
    });

    return prepared.map((x) => x.balance);
};

const prepareBalances = (
    value: [
        AssetBalances,
        AssetsInfoWhitelist,
        VerifiedAssetInfoWhitelist,
        LocalBlacklistVerifiedAssets,
        CurrentPriceForAssets,
        WalletSettings
    ]
): AssetBalances => {
    const [
        assetBalances,
        assetInfoWhitelist,
        verifiedAssetInfoWhitelist,
        localBlacklistVerifiedAssets,
        currentPriceForAssets,
        walletSettings,
    ] = value;

    const ensureLogoAndPriceUrl = (asset_info: AssetInfo): AssetInfo => ({
        ...asset_info,
        logo: asset_info.logo || (asset_info.asset_id === ZANO_ASSET_INFO.asset_id ? ZANO_ASSET_INFO.logo : DEFAULT_ASSET_LOGO_SRC),
        price_url: asset_info.price_url || (asset_info.asset_id === ZANO_ASSET_INFO.asset_id ? ZANO_ASSET_INFO.price_url : ''),
    });

    // Build map for O(1) updates by asset_id
    const byId = new Map<string, AssetBalance>(
        (assetBalances ?? []).map((b) => [
            b.asset_info.asset_id,
            {
                ...b,
                asset_info: ensureLogoAndPriceUrl(b.asset_info),
            },
        ])
    );

    // Verified whitelist: ensure asset exists; verified metadata overrides
    for (const asset_info of verifiedAssetInfoWhitelist) {
        const id = asset_info.asset_id;
        const existing = byId.get(id);

        if (existing) {
            byId.set(id, {
                ...existing,
                asset_info: {
                    ...existing.asset_info,
                    ...ensureLogoAndPriceUrl(asset_info),
                },
            });
        } else {
            byId.set(id, {
                asset_info: ensureLogoAndPriceUrl(asset_info),
                awaiting_in: 0,
                awaiting_out: 0,
                total: 0,
                unlocked: 0,
            });
        }
    }

    // Whitelists: enrich existing balances' metadata (do not create new rows here)
    const { global_whitelist, local_whitelist, own_assets } = assetInfoWhitelist;
    const allWhitelistedAssets = [...global_whitelist, ...local_whitelist, ...own_assets];

    for (const asset_info of allWhitelistedAssets) {
        const id = asset_info.asset_id;
        const existing = byId.get(id);
        if (!existing) continue;

        byId.set(id, {
            ...existing,
            asset_info: {
                ...ensureLogoAndPriceUrl(asset_info),
                ...existing.asset_info,
            },
        });
    }

    const blacklist = new Set(localBlacklistVerifiedAssets ?? []);
    const items = Array.from(byId.values()).filter(({ asset_info }) => !blacklist.has(asset_info.asset_id));

    return sortBalances(items, verifiedAssetInfoWhitelist, currentPriceForAssets, walletSettings);
};

export interface WalletSettings {
    balanceDisplayMode: 'zano' | 'fiat';
    hideEmptyAssets: boolean;
}

export class Wallet {
    settings: WalletSettings = {
        balanceDisplayMode: 'fiat',
        hideEmptyAssets: false,
    };

    readonly settingsChanged$ = new BehaviorSubject<WalletSettings>(this.settings);

    open_from_exist!: boolean;

    updated = false;

    wallet_id: number;

    name: string;

    pass: string;

    path: string;

    address: string;

    assetsInfoWhitelist: AssetsInfoWhitelist = DEFAULT_ASSETS_INFO_WHITELIST;

    get allAssetsInfoWhitelist(): AssetInfo[] {
        const { global_whitelist = [], local_whitelist = [], own_assets = [] } = this.assetsInfoWhitelist;
        return [...global_whitelist, ...local_whitelist, ...own_assets];
    }

    get allAssetsInfo(): AssetInfo[] {
        return [ZANO_ASSET_INFO, ...this.allAssetsInfoWhitelist];
    }

    readonly originalBalances$ = new BehaviorSubject<AssetBalances>([]);

    readonly assetsInfoWhitelist$ = new BehaviorSubject<AssetsInfoWhitelist>(DEFAULT_ASSETS_INFO_WHITELIST);

    readonly verificationAssetsInfoWhitelist$ = new BehaviorSubject<VerifiedAssetInfoWhitelist>([]);

    readonly localBlacklistVerifiedAssets$ = new BehaviorSubject<LocalBlacklistVerifiedAssets>([]);

    readonly currentPriceForAssets$ = new BehaviorSubject<CurrentPriceForAssets>({});

    readonly balances$ = new BehaviorSubject<AssetBalances>([]);

    private readonly _balancesSubscription: Subscription;

    get balances(): AssetBalances {
        return this.balances$.value;
    }

    set balances(value: AssetBalances | null | undefined) {
        this.originalBalances$.next(value?.length ? value : DEFAULT_BALANCES);
    }

    mined_total: number;

    tracking_hey: string;

    is_auditable!: boolean;

    is_watch_only!: boolean;

    exclude_mining_txs!: boolean;

    alias_available!: boolean;

    has_bare_unspent_outputs = false;

    get alias_info(): null | AliasInfo {
        return this.alias_info_list[this.alias_info_list.length - 1] ?? null;
    }

    alias_info_list: AliasInfoList = [];

    staking?: boolean;

    new_messages?: number;

    new_contracts?: number;

    history: Transactions = [];

    total_history_item?: number;

    pages: any[] = [];

    totalPages!: number;

    currentPage!: number;

    excluded_history: Transactions = [];

    contracts: Contracts = [];

    progress?: number;

    loaded?: boolean;

    restore?: boolean;

    transfer_form_value: TransferFormValue | null = null;

    constructor(
        id: number,
        name: string,
        pass: string,
        path: string,
        address: string,
        balances: AssetBalances | null | undefined,
        unlocked_balance: number,
        mined = 0,
        tracking = ''
    ) {
        this.wallet_id = id;
        this.name = name;
        this.pass = pass;
        this.path = path;
        this.address = address;
        this.balances = balances;
        this.mined_total = mined;
        this.tracking_hey = tracking;
        this.staking = false;
        this.new_messages = 0;
        this.new_contracts = 0;

        this.history = [];
        this.excluded_history = [];

        this.progress = 0;
        this.loaded = false;

        this._balancesSubscription = combineLatest([
            this.originalBalances$,
            this.assetsInfoWhitelist$,
            this.verificationAssetsInfoWhitelist$,
            this.localBlacklistVerifiedAssets$,
            this.currentPriceForAssets$,
            this.settingsChanged$,
        ])
            .pipe(map(prepareBalances))
            .subscribe({
                next: (value) => {
                    this.balances$.next(value);
                },
            });
    }

    destroy(): void {
        this._balancesSubscription.unsubscribe();
    }

    getBalanceByAssetId(value: string): AssetBalance | undefined {
        return this.balances.find(({ asset_info: { asset_id } }) => asset_id === value);
    }

    getAssetInfoByAssetId(value: string): AssetInfo | undefined {
        return this.allAssetsInfo.find(({ asset_id }) => asset_id === value);
    }

    getBalanceByTicker(searchTicker: string): AssetBalance | undefined {
        return this.balances.find(({ asset_info: { ticker } }) => ticker === searchTicker);
    }

    prepareHistory(items: Transaction[]): void {
        for (let i = 0; i < items.length; i++) {
            const tx = items[i];
            const hasIncoming = tx.subtransfers_by_pid?.some((g) => g.subtransfers.some((s) => s.is_income));

            if ((tx.tx_type === 7 || tx.tx_type === 11) && hasIncoming) {
                let exists = false;
                for (let j = 0; j < this.excluded_history.length; j++) {
                    if (this.excluded_history[j].tx_hash === tx.tx_hash) {
                        exists = true;
                        if (this.excluded_history[j].height !== tx.height) {
                            this.excluded_history[j] = tx;
                        }
                        break;
                    }
                }
                if (!exists) {
                    this.excluded_history.push(tx);
                }
            } else {
                let exists = false;
                for (let j = 0; j < this.history.length; j++) {
                    if (this.history[j].tx_hash === tx.tx_hash) {
                        exists = true;
                        if (this.history[j].height !== tx.height) {
                            this.history[j] = tx;
                        }
                        break;
                    }
                }
                if (!exists) {
                    if (this.history.length > 0 && tx.timestamp >= this.history[0].timestamp) {
                        this.history.unshift(tx);
                    } else {
                        this.history.push(tx);
                    }
                }
            }
        }
    }

    removeFromHistory(hash: string): void {
        for (let i = 0; i < this.history.length; i++) {
            if (this.history[i].tx_hash === hash) {
                this.history.splice(i, 1);
                break;
            }
        }
    }

    addAssetToLocalBlacklistVerifiedAssets(asset_id: string): void {
        const blackList: LocalBlacklistVerifiedAssets = [...this.localBlacklistVerifiedAssets$.value, asset_id];
        this.localBlacklistVerifiedAssets$.next(blackList);
    }

    removeAssetFromLocalBlacklistVerifiedAssets(asset_id: string): void {
        const blackList: LocalBlacklistVerifiedAssets = this.localBlacklistVerifiedAssets$.value.filter((v) => v !== asset_id);
        this.localBlacklistVerifiedAssets$.next(blackList);
    }

    setHideEmptyAssets(value: boolean): void {
        if (this.settings.hideEmptyAssets === value) return;

        this.settings = {
            ...this.settings,
            hideEmptyAssets: value,
        };
        this.settingsChanged$.next(this.settings);
    }
}

export interface ResponseGetWalletInfo {
    address: string;
    balances: AssetBalances;
    is_auditable: boolean;
    is_watch_only: boolean;
    mined_total: number;
    path: string;
    view_sec_key: string;
}
