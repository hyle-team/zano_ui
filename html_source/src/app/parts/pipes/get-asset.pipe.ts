import { inject, Pipe, PipeTransform } from '@angular/core';
import { Asset, AssetInfo } from '@api/models/assets.model';
import { WalletsService } from '@parts/services/wallets.service';

@Pipe({
  name: 'getAsset',
  standalone: true,
})
export class GetAssetPipe implements PipeTransform {
  private walletsService = inject(WalletsService);

  transform(value: AssetInfo['asset_id']): Asset | undefined {
    const currentWallet = this.walletsService.currentWallet;
    if (!currentWallet) {
      return;
    }
    return currentWallet.balances.find(({ asset_info: { asset_id } }) => asset_id === value);
  }
}
