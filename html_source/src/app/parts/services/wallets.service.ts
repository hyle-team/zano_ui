import { inject, Injectable, NgZone } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ResponseGetWalletInfo, Wallet } from '@api/models/wallet.model';
import { Router } from '@angular/router';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { AssetsWhitelistGetResponseData } from '@api/models/assets.model';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '@parts/services/modal.service';

@Injectable({
    providedIn: 'root',
})
export class WalletsService {
    get wallets(): Wallet[] {
        return this.variablesService.wallets;
    }

    set wallets(value) {
        this.variablesService.wallets = value ?? [];
    }

    get currentWallet(): Wallet | null | undefined {
        return this.variablesService.currentWallet;
    }

    set currentWallet(value) {
        this.variablesService.currentWallet = value;
    }

    constructor(
        private backendService: BackendService,
        private variablesService: VariablesService,
        private router: Router,
        private ngZone: NgZone,
        private _translateService: TranslateService,
        private _modalService: ModalService
    ) {}

    addWallet(wallet: Wallet): void {
        const { wallet_id, staking } = wallet;

        if (staking) {
            const text = this._translateService.instant('STAKING.WALLET_STAKING_ON', { value: wallet.alias?.name ?? wallet.name });
            this._modalService.prepareModal('info', text, { oneOverlay: true });
        }

        this.variablesService.wallets.push(wallet);
        this.updateWalletInfo(wallet_id);
    }

    loadAssetsWhitelist(wallet_id: number): void {
        const wallet = this.getWalletById(wallet_id);

        if (!wallet) {
            console.warn(`You want update assetsWhiteList by wallet_id: (${wallet_id}). But this wallet not uploaded.`);
            return;
        }

        const params: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: 0,
            method: 'assets_whitelist_get',
            params: {},
        };
        this.backendService.call_wallet_rpc([wallet_id, params], (status, response_data: AssetsWhitelistGetResponseData) => {
            const { result } = response_data;
            wallet.assetsInfoWhitelist = result;
        });
    }

    getWalletById(wallet_id: number): Wallet | undefined {
        const { wallets } = this.variablesService;
        return wallets.find(w => w.wallet_id === wallet_id);
    }

    updateWalletInfo(wallet_id: number): void {
        const wallet = this.getWalletById(wallet_id);

        if (!wallet) {
            console.warn(`You want update walletInfo by wallet_id: (${wallet_id}). But this wallet not uploaded.`);
            return;
        }
        const callback: (status: boolean, response_data: ResponseGetWalletInfo) => void = (status, response_data) => {
            this.ngZone.run(() => {
                if (status) {
                    const { balances } = response_data;
                    wallet.balances = balances;
                }
            });
        };

        this.backendService.getWalletInfo(wallet_id, callback);

        this.loadAssetsWhitelist(wallet_id);
    }

    closeWallet(wallet_id: number): void {
        const callback = async (): Promise<void> => {
            this.wallets = this.wallets.filter(w => w.wallet_id !== wallet_id);

            await this.ngZone.run(async () => {
                let url = '/';
                if (this.wallets.length > 0) {
                    this.currentWallet = this.wallets[0];
                    url = '/wallet/';
                }
                if (this.variablesService.appPass) {
                    this.backendService.storeSecureAppData();
                }
                await this.router.navigate([url]);
            });
        };

        this.backendService.closeWallet(wallet_id, callback);
    }
}
