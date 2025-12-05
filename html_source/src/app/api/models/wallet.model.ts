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
import { BehaviorSubject, combineLatest } from 'rxjs';
import { AliasInfo, AliasInfoList } from '@api/models/alias.model';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { map } from 'rxjs/operators';
import { DEFAULT_ASSET_LOGO_SRC } from '@parts/data/constants';
import { CurrentPriceForAssets } from '@api/models/api-zano.models';
import { getFiatValue } from '@parts/functions/get-fiat-value';
import { TransferFormValue } from '../../pages/wallet/tabs/send/send.component';

export const defaultAssetsInfoWhitelist = { global_whitelist: [], local_whitelist: [], own_assets: [] };

const defaultBalances = [
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
    currentPriceForAssets: CurrentPriceForAssets,
    currency: string = 'usd'
): AssetBalances => {
    if (!value || value.length === 0) return [];

    // Copy of the array to avoid mutating the input data
    const assets = [...value];

    // We take out ZANO (if there is one) and fix it first
    const sortedBalances: AssetBalances = [];
    const zanoIndex = assets.findIndex(({ asset_info: { ticker } }) => ticker === 'ZANO');
    if (zanoIndex >= 0) {
        const zano = assets.splice(zanoIndex, 1)[0];
        sortedBalances.push(zano);
    }

    // Pre-calculated fiat value for each asset (with safe null/NaN handling)
    const withFiat = assets.map((balance) => {
        const val = getFiatValue(balance, currentPriceForAssets, currency);
        const bn = val === null ? new BigNumber(0) : new BigNumber(val);
        const safeBn = bn.isFinite() && !bn.isNaN() ? bn : new BigNumber(0);
        return { balance, fiat: safeBn };
    });

    // Sort by fiat value descending, then by ticker (stable tiebreaker)
    withFiat.sort((a, b) => {
        const byFiat = b.fiat.comparedTo(a.fiat);
        if (byFiat !== 0) return byFiat;
        const ta = a.balance.asset_info?.ticker ?? '';
        const tb = b.balance.asset_info?.ticker ?? '';
        return ta.localeCompare(tb);
    });

    sortedBalances.push(...withFiat.map(({ balance }) => balance));
    return sortedBalances;
};

const prepareBalances = (
    value: [AssetBalances, AssetsInfoWhitelist, VerifiedAssetInfoWhitelist, LocalBlacklistVerifiedAssets, CurrentPriceForAssets]
): AssetBalances => {
    const [assetBalances, assetInfoWhitelist, verifiedAssetInfoWhitelist, localBlacklistVerifiedAssets, currentPriceForAssets] = value;

    let items: AssetBalances = [...assetBalances];

    const ensureLogoAndPriceUrl = (asset_info: AssetInfo): AssetInfo => ({
        ...asset_info,
        logo: asset_info.logo || (asset_info.asset_id === ZANO_ASSET_INFO.asset_id ? ZANO_ASSET_INFO.logo : DEFAULT_ASSET_LOGO_SRC),
        price_url: asset_info.price_url || (asset_info.asset_id === ZANO_ASSET_INFO.asset_id ? ZANO_ASSET_INFO.price_url : ''),
    });

    for (const asset_info of verifiedAssetInfoWhitelist) {
        const assetBalance = items.find((i) => i.asset_info.asset_id === asset_info.asset_id);

        if (assetBalance) {
            assetBalance.asset_info = { ...assetBalance.asset_info, ...ensureLogoAndPriceUrl(asset_info) };
        } else {
            items.push({
                asset_info: ensureLogoAndPriceUrl(asset_info),
                awaiting_in: 0,
                awaiting_out: 0,
                total: 0,
                unlocked: 0,
            });
        }
    }

    const { global_whitelist, local_whitelist, own_assets } = assetInfoWhitelist;
    const allWhitelistedAssets = [...global_whitelist, ...local_whitelist, ...own_assets];

    for (const asset_info of allWhitelistedAssets) {
        const assetBalance = items.find((i) => i.asset_info.asset_id === asset_info.asset_id);

        if (assetBalance) {
            assetBalance.asset_info = { ...ensureLogoAndPriceUrl(asset_info), ...assetBalance.asset_info };
        }
    }

    for (const assetBalance of items) {
        assetBalance.asset_info = ensureLogoAndPriceUrl(assetBalance.asset_info);
    }

    if (localBlacklistVerifiedAssets.length) {
        items = items.filter(({ asset_info: { asset_id } }: AssetBalance): boolean => !localBlacklistVerifiedAssets.includes(asset_id));
    }

    return sortBalances(items, currentPriceForAssets);
};

export class Wallet {
    settings: { balanceDisplayMode: 'zano' | 'fiat' } = {
        balanceDisplayMode: 'fiat',
    };

    open_from_exist: boolean;

    updated = false;

    wallet_id: number;

    name: string;

    pass: string;

    path: string;

    address: string;

    assetsInfoWhitelist: AssetsInfoWhitelist = defaultAssetsInfoWhitelist;

    get allAssetsInfoWhitelist(): AssetInfo[] {
        const { global_whitelist = [], local_whitelist = [], own_assets = [] } = this.assetsInfoWhitelist;
        return [...global_whitelist, ...local_whitelist, ...own_assets];
    }

    get allAssetsInfo(): AssetInfo[] {
        return [ZANO_ASSET_INFO, ...this.allAssetsInfoWhitelist];
    }

    originalBalances$: BehaviorSubject<AssetBalances> = new BehaviorSubject<AssetBalances>([]);

    assetsInfoWhitelist$: BehaviorSubject<AssetsInfoWhitelist> = new BehaviorSubject(defaultAssetsInfoWhitelist);

    verificationAssetsInfoWhitelist$: BehaviorSubject<VerifiedAssetInfoWhitelist> = new BehaviorSubject<VerifiedAssetInfoWhitelist>([]);

    localBlacklistVerifiedAssets$: BehaviorSubject<LocalBlacklistVerifiedAssets> = new BehaviorSubject<LocalBlacklistVerifiedAssets>([]);

    currentPriceForAssets$: BehaviorSubject<CurrentPriceForAssets> = new BehaviorSubject({});

    balances$: BehaviorSubject<AssetBalances> = new BehaviorSubject([]);

    get balances(): AssetBalances {
        return this.balances$.value;
    }

    set balances(value: AssetBalances | null | undefined) {
        this.originalBalances$.next(value?.length ? value : defaultBalances);
    }

    mined_total: number;

    tracking_hey: string;

    is_auditable: boolean;

    is_watch_only: boolean;

    exclude_mining_txs: boolean;

    alias_available: boolean;

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

    pages = [];

    totalPages: number;

    currentPage: number;

    excluded_history: Transactions = [];

    contracts: Contracts = [];

    progress?: number;

    loaded?: boolean;

    restore?: boolean;

    transfer_form_value: TransferFormValue | null = null;

    constructor(id, name, pass, path, address, balances, unlocked_balance, mined = 0, tracking = '') {
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

        combineLatest([
            this.originalBalances$,
            this.assetsInfoWhitelist$,
            this.verificationAssetsInfoWhitelist$,
            this.localBlacklistVerifiedAssets$,
            this.currentPriceForAssets$,
        ])
            .pipe(map(prepareBalances))
            .subscribe({
                next: (value) => {
                    this.balances$.next(value);
                },
            });
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

    getMoneyEquivalentForZano(equivalent): string {
        const balanceZano = this.getBalanceByTicker('ZANO')?.total || 0;
        return new BigNumber(balanceZano).multipliedBy(equivalent).toFixed(0);
    }

    prepareHistory(items: Transaction[]): void {
        for (let i = 0; i < items.length; i++) {
            if (
                (items[i].tx_type === 7 && items[i].subtransfers?.find(({ is_income }) => is_income)) ||
                (items[i].tx_type === 11 && items[i].subtransfers?.find(({ is_income }) => is_income))
            ) {
                let exists = false;
                for (let j = 0; j < this.excluded_history.length; j++) {
                    if (this.excluded_history[j].tx_hash === items[i].tx_hash) {
                        exists = true;
                        if (this.excluded_history[j].height !== items[i].height) {
                            this.excluded_history[j] = items[i];
                        }
                        break;
                    }
                }
                if (!exists) {
                    this.excluded_history.push(items[i]);
                }
            } else {
                let exists = false;
                for (let j = 0; j < this.history.length; j++) {
                    if (this.history[j].tx_hash === items[i].tx_hash) {
                        exists = true;
                        if (this.history[j].height !== items[i].height) {
                            this.history[j] = items[i];
                        }
                        break;
                    }
                }
                if (!exists) {
                    if (this.history.length > 0 && items[i].timestamp >= this.history[0].timestamp) {
                        this.history.unshift(items[i]);
                    } else {
                        this.history.push(items[i]);
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
}

export interface Deeplink {
    action?: 'send' | 'escrow' | 'marketplace_offer_create';
    // TODO: Create new interfaces for escrow and marketplace_offer_create
    my_deposit?: string;
    seller_deposit?: string;
    seller_address?: string;
    hide_sender?: string;
    hide_receiver?: string;
    title?: string;
    description?: string;
    category?: string;
    price?: string;
    img_url?: string;
    url?: string;
    contact?: string;
    comments?: string;
    mixins?: string;
    fee?: string;
}

export interface SendDeeplink extends Deeplink {
    address?: string;
    amount?: string;
    asset_id?: string;
    comment?: string;
}

export interface PushOffer {
    wallet_id: number;
    od: {
        ap: string;
        at: string;
        cat: string;
        cnt: string;
        com: string;
        do: string;
        et: number;
        fee: BigNumber;
        lci: string;
        lco: string;
        ot: number;
        pt: string;
        t: string;
        url: string;
    };
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
