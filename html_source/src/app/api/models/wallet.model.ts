import { Contracts } from './contract.model';
import { Transaction, Transactions } from './transaction.model';
import { BigNumber } from 'bignumber.js';
import { AssetBalance, AssetInfo, AssetBalances, AssetsInfoWhitelist } from './assets.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alias } from '@api/models/alias.model';
import { SendMoneyFormParams } from '@api/models/send-money.model';
import { MIXIN } from '@parts/data/constants';
import { zanoAssetInfo } from '@parts/data/assets';

export const defaultSendMoneyParams: SendMoneyFormParams = {
    asset_id: zanoAssetInfo.asset_id,
    wallet_id: undefined,
    address: '',
    amount: undefined,
    isAmountUSD: false,
    comment: '',
    mixin: MIXIN,
    fee: '0.01',
    push_payer: true,
    hide_receiver: false,
};

const defaultAssetsInfoWhitelist = { global_whitelist: [], local_whitelist: [], own_assets: [] };

export class Wallet {
    open_from_exist: boolean;

    updated = false;

    wallet_id: number;

    name: string;

    pass: string;

    path: string;

    address: string;

    private _balances$: BehaviorSubject<AssetBalances> = new BehaviorSubject<AssetBalances>([]);

    private _assetsInfoWhitelist: AssetsInfoWhitelist = defaultAssetsInfoWhitelist;

    set assetsInfoWhitelist(value: AssetsInfoWhitelist) {
        this._assetsInfoWhitelist = value ?? defaultAssetsInfoWhitelist;
    }

    get assetsInfoWhitelist() {
        return this._assetsInfoWhitelist;
    }

    get allAssetsInfoWhitelist(): AssetInfo[] {
        const { global_whitelist = [], local_whitelist = [], own_assets = [] } = this._assetsInfoWhitelist;
        return [...global_whitelist, ...local_whitelist, ...own_assets];
    }

    get isEmptyAssetsInfoWhitelist(): boolean {
        return !this.allAssetsInfoWhitelist.length;
    }

    get allAssetsInfo(): AssetInfo[] {
        return [zanoAssetInfo, ...this.allAssetsInfoWhitelist];
    }

    get balances$(): Observable<AssetBalances> {
        return this._balances$.asObservable();
    }

    get balances(): AssetBalances {
        return this._balances$.value;
    }

    set balances(value: AssetBalances | null | undefined) {
        const sortedAssets: AssetBalances = [];
        if (value) {
            const assets = [...value];
            const indexZano = assets.findIndex(({ asset_info: { ticker } }) => ticker === 'ZANO');
            if (indexZano >= 0) {
                const assetZano = assets.splice(indexZano, 1)[0];
                sortedAssets.push(assetZano);
            }
            const sortedAssetsByBalance = assets.sort((a, b) => new BigNumber(b.total).minus(new BigNumber(a.total)).toNumber());
            sortedAssets.push(...sortedAssetsByBalance);
        }
        this._balances$.next(sortedAssets);
    }

    get isEmptyBalances(): boolean {
        if (!this.balances) {
            return true;
        }

        for (const asset of this.balances) {
            const value = asset.total || 0;
            const isEmpty = !Boolean(new BigNumber(value).toNumber());

            if (!isEmpty) {
                return false;
            }
        }

        return true;
    }

    mined_total: number;

    tracking_hey: string;

    is_auditable: boolean;

    is_watch_only: boolean;

    exclude_mining_txs: boolean;

    alias_available: boolean;

    has_bare_unspent_outputs = false;

    alias?: Partial<Alias>;

    wakeAlias?: boolean;

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

    sendMoneyParams: SendMoneyFormParams | null = null;

    constructor(id, name, pass, path, address, balances, unlocked_balance, mined = 0, tracking = '') {
        this.wallet_id = id;
        this.name = name;
        this.pass = pass;
        this.path = path;
        this.address = address;
        this.balances = balances;
        this.mined_total = mined;
        this.tracking_hey = tracking;

        this.alias = {};
        this.staking = false;
        this.new_messages = 0;
        this.new_contracts = 0;

        this.history = [];
        this.excluded_history = [];

        this.progress = 0;
        this.loaded = false;
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
}

export interface DeeplinkParams {
    action?: 'send' | string;
    address?: string;
    amount?: string;
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
    comment?: string;
    comments?: string;
    mixins?: string;
    fee?: string;
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
