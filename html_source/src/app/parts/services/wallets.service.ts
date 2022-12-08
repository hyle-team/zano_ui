import { Injectable, NgZone } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ResponseGetWalletInfo, Wallet } from '@api/models/wallet.model';

@Injectable({
  providedIn: 'root',
})
export class WalletsService {
  constructor(
    private backendService: BackendService,
    private variablesService: VariablesService,
    private ngZone: NgZone
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
    const callback: (
      status: boolean,
      response_data: ResponseGetWalletInfo
    ) => void = (status, response_data) => {
      this.ngZone.run(() => {
        if (status) {
          const { balances } = response_data;
          wallet.balances = balances;
        }
      });
    };

    this.backendService.getWalletInfo(wallet_id, callback);
  }
}
