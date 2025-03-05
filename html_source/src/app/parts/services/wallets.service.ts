import { Injectable, NgZone } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { defaultAssetsInfoWhitelist, ResponseGetWalletInfo, Wallet } from '@api/models/wallet.model';
import { Router } from '@angular/router';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { AssetsWhitelistGetResponseData, VerifiedAssetInfoWhitelist } from '@api/models/assets.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
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

    constructor(
        private _backendService: BackendService,
        private _variablesService: VariablesService,
        private _translateService: TranslateService,
        private _router: Router,
        private _ngZone: NgZone
    ) {}

    addWallet(wallet: Wallet): void {
        const { wallet_id, staking, address } = wallet;
        const {
            verifiedAssetInfoWhitelist,
            settings: { localBlacklistsOfVerifiedAssetsByWallets }
        } = this._variablesService;

        if (staking) {
            const message = this._translateService.instant('STAKING.WALLET_STAKING_ON', { value: wallet.alias?.name ?? wallet.name });
            this._backendService.show_notification('Wallet staking on', message);
        }

        if (localBlacklistsOfVerifiedAssetsByWallets[address]) {
            wallet.localBlacklistVerifiedAssets$.next(localBlacklistsOfVerifiedAssetsByWallets[address]);
        }

        this._variablesService.wallets.push(wallet);
        this.updateWalletInfo(wallet_id);
        this.setVerifiedAssetInfoWhitelist(verifiedAssetInfoWhitelist);
    }

    loadAssetsInfoWhitelist(wallet_id: number): void {
        const wallet = this.getWalletById(wallet_id);

        if (!wallet) {
            console.warn(`You want update assetsWhiteList by wallet_id: (${wallet_id}). But this wallet not uploaded.`);
            return;
        }

        const params: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: 0,
            method: 'assets_whitelist_get',
            params: {}
        };
        this._backendService.call_wallet_rpc([wallet_id, params], (status, response_data: AssetsWhitelistGetResponseData) => {
            this._ngZone.run(() => {
                const { result } = response_data;
                const assetsInfoWhitelist = { ...defaultAssetsInfoWhitelist, ...result };

                wallet.assetsInfoWhitelist = assetsInfoWhitelist;
                wallet.assetsInfoWhitelist$.next(assetsInfoWhitelist);
            });
        });
    }

    setVerifiedAssetInfoWhitelist(assets: VerifiedAssetInfoWhitelist): void {
        for (const wallet of this.wallets) {
            wallet.verificationAssetsInfoWhitelist$.next(assets);
        }
    }

    getWalletById(wallet_id: number): Wallet | undefined {
        const { wallets } = this._variablesService;
        return wallets.find(w => w.wallet_id === wallet_id);
    }

    updateWalletInfo(wallet_id: number): void {
        const wallet = this.getWalletById(wallet_id);

        if (!wallet) {
            console.warn(`You want update walletInfo by wallet_id: (${wallet_id}). But this wallet not uploaded.`);
            return;
        }
        const callback: (status: boolean, response_data: ResponseGetWalletInfo) => void = (status, response_data) => {
            this._ngZone.run(() => {
                if (status) {
                    const { balances } = response_data;
                    wallet.balances = balances;

                    this._variablesService.loadCurrentPriceForAssets(wallet.balances);
                }
            });
        };

        this._backendService.getWalletInfo(wallet_id, callback);

        this.loadAssetsInfoWhitelist(wallet_id);
    }

    closeWallet(wallet_id: number): void {
        const callback = async (): Promise<void> => {
            this.wallets = this.wallets.filter(w => w.wallet_id !== wallet_id);

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
