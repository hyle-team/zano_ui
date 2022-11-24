import { Pipe, PipeTransform } from '@angular/core';
import { AssetInfo, AssetsInfo } from '../../../api/models/assets.model';

@Pipe({
  name: 'getAssetInfoById',
})
export class GetAssetInfoByIdPipe implements PipeTransform {
  transform(
    assetsInfo: AssetsInfo = [],
    asset_id: string
  ): AssetInfo | undefined {
    return assetsInfo.find(item => item.asset_id === asset_id);
  }
}
