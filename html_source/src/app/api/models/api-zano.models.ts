import { PriceInfo } from '@api/models/assets.model';

export interface CurrentPriceForAssets {
    [key: string]: PriceInfo;
}
