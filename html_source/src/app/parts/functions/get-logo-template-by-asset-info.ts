import { AssetInfo } from '@api/models/assets.model';
import { DEFAULT_ASSET_LOGO_SRC } from '@parts/data/constants';

export const getLogoTemplateByAssetInfo = ({ logo, ticker }: AssetInfo): string => {
    if (logo?.includes('<svg')) {
        return logo;
    } else {
        return `<img alt="${ticker}" src="${logo ?? DEFAULT_ASSET_LOGO_SRC}"/>`;
    }
};
