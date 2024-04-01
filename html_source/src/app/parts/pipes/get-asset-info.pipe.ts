import { inject, Pipe, PipeTransform } from '@angular/core';
import { AssetInfo } from '@api/models/assets.model';
import { WalletsService } from '@parts/services/wallets.service';
@Pipe({
    name: 'getAssetInfo',
    standalone: true,
})
export class GetAssetInfoPipe implements PipeTransform {
    private walletsService = inject(WalletsService);

    transform(value: AssetInfo['asset_id']): AssetInfo | undefined {
        return this.walletsService.currentWallet?.allAssetsInfo.find(({ asset_id }) => asset_id === value);
    }
}
