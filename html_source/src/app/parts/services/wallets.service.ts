import { Injectable } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { Wallet } from '@api/models/wallet.model';

@Injectable({
  providedIn: 'root',
})
export class WalletsService {
  constructor(
    private backendService: BackendService,
    private variablesService: VariablesService
  ) {}

  getWalletById(wallet_id: number): Wallet | undefined {
    const { wallets } = this.variablesService;
    return wallets.find(w => w.wallet_id === wallet_id);
  }

  updateWalletInfo(wallet_id: number): void {
    const wallet = this.getWalletById(wallet_id);

    if (!wallet) {
      return;
    }
    const callback = (status, response_data) => {
      console.log('getWalletInfo', status, response_data);
    };

    this.backendService.getWalletInfo(wallet_id, callback);
  }
}
