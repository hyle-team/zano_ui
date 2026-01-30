import { Injectable, NgZone } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { DEFAULT_ASSETS_INFO_WHITELIST, ResponseGetWalletInfo, Wallet } from '@api/models/wallet.model';
import { Router } from '@angular/router';
import { ParamsCallRpc, ResponseCallRpc } from '@api/models/call_rpc.model';
import { AssetsWhitelistGetResponseData, VerifiedAssetInfoWhitelist } from '@api/models/assets.model';
import { TranslateService } from '@ngx-translate/core';
import { ResultAliasByAddress } from '@api/models/rpc.models';

@Injectable({
    providedIn: 'root',
})
export class WalletsService {
    get wallets(): Wallet[] {
        return this._variablesService.wallets;
    }

    set wallets(value) {
        this._variablesService.wallets = value ?? [];
    }

    get currentWallet(): Wallet | null | undefined {
        return this._variablesService.current_wallet;
    }

    set currentWallet(value) {
        this._variablesService.current_wallet = value;
    }

    get opened_wallet_items(): string[] {
        const items = new Set([]);

        this.wallets.forEach(({ address, alias_info_list }: Wallet) => {
            if (alias_info_list.length > 0) {
                alias_info_list.forEach((alias_info) => {
                    if (alias_info.alias) {
                        items.add('@' + alias_info.alias);
                    } else if (alias_info.address) {
                        items.add(alias_info.address);
                    } else {
                        items.add(address);
                    }
                });
            } else {
                items.add(address);
            }
        });

        return [...items];
    }

    constructor(
        private _backendService: BackendService,
        private _variablesService: VariablesService,
        private _translateService: TranslateService,
        private _router: Router,
        private _ngZone: NgZone
    ) {
        this._variablesService.currentPriceForAssets$.subscribe((value) => {
            this.wallets.forEach((wallet: Wallet) => {
                wallet.currentPriceForAssets$.next(value);
            });
        });
    }

    addWallet(wallet: Wallet): void {
        const { staking, address, name } = wallet;
        const {
            verifiedAssetInfoWhitelist,
            settings: { localBlacklistsOfVerifiedAssetsByWallets },
        } = this._variablesService;

        if (staking) {
            const message = this._translateService.instant('STAKING.WALLET_STAKING_ON', { value: wallet.alias_info?.alias ?? wallet.name });
            this._backendService.show_notification('Wallet staking on', message);
        }

        if (localBlacklistsOfVerifiedAssetsByWallets[address]) {
            wallet.localBlacklistVerifiedAssets$.next(localBlacklistsOfVerifiedAssetsByWallets[address]);
        }

        const walletSetting = this._variablesService.settings.wallets.find((w) => w.name === name)?.settings;
        if (walletSetting) {
            wallet.settings = walletSetting;
            wallet.settingsChanged$.next(walletSetting);
        }

        this._variablesService.wallets.push(wallet);
        this.updateWalletInfo(wallet);
        this.loadAliasInfoList(wallet);
        this.setVerifiedAssetInfoWhitelist(verifiedAssetInfoWhitelist);
    }

    loadAssetsInfoWhitelist(wallet: Wallet): void {
        const { wallet_id } = wallet;
        const params: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: 0,
            method: 'assets_whitelist_get',
            params: {},
        };
        this._backendService.call_wallet_rpc([wallet_id, params], (status, response_data: AssetsWhitelistGetResponseData) => {
            this._ngZone.run(() => {
                const { result } = response_data;
                const assetsInfoWhitelist = { ...DEFAULT_ASSETS_INFO_WHITELIST, ...result };

                wallet.assetsInfoWhitelist = assetsInfoWhitelist;
                wallet.assetsInfoWhitelist$.next(assetsInfoWhitelist);
            });
        });
    }

    loadAliasInfoList(wallet: Wallet): void {
        const params = {
            id: 0,
            jsonrpc: '2.0',
            method: 'get_alias_by_address',
            params: wallet.address,
        };
        this._backendService.call_rpc(params, (status: boolean, response_data: ResponseCallRpc<ResultAliasByAddress>) => {
            this._ngZone.run(() => {
                wallet.alias_info_list = response_data?.result?.alias_info_list?.filter(Boolean) ?? [];
            });
        });
    }

    loadAliasInfoListForWallets(): void {
        this.wallets.forEach((wallet: Wallet) => {
            this.loadAliasInfoList(wallet);
        });
    }

    setVerifiedAssetInfoWhitelist(assets: VerifiedAssetInfoWhitelist): void {
        for (const wallet of this.wallets) {
            wallet.verificationAssetsInfoWhitelist$.next(assets);
        }
    }

    getWalletById(wallet_id: number): Wallet | undefined {
        const { wallets } = this._variablesService;
        return wallets.find((w) => w.wallet_id === wallet_id);
    }

    getOpenedWalletByAddress(address: string): Wallet | undefined {
        const { wallets } = this._variablesService;
        return wallets.find((w) => w.address === address);
    }

    updateWalletInfo(wallet: Wallet): void {
        const { wallet_id } = wallet;

        const callback: (status: boolean, response_data: ResponseGetWalletInfo) => void = (status, response_data) => {
            this._ngZone.run(() => {
                if (status) {
                    const { balances } = response_data;
                    wallet.balances = balances;

                    this._variablesService.loadCurrentPriceForAssetIds(wallet.balances.map(({ asset_info: { asset_id } }) => asset_id));
                }
            });
        };

        this._backendService.getWalletInfo(wallet_id, callback);

        this.loadAssetsInfoWhitelist(wallet);
    }

    closeWallet(wallet_id: number): void {
        const callback = async (): Promise<void> => {
            this.wallets = this.wallets.filter((w) => w.wallet_id !== wallet_id);

            await this._ngZone.run(async () => {
                let url = '/';
                if (this.wallets.length > 0) {
                    this.currentWallet = this.wallets[0];
                    url = '/wallet/';
                }
                if (this._variablesService.appPass) {
                    this._backendService.storeSecureAppData();
                }
                await this._router.navigate([url]);
            });
        };

        this._backendService.closeWallet(wallet_id, callback);
    }
}
