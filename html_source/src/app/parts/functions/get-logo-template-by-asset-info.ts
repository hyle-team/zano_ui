import { AssetInfo } from '@api/models/assets.model';
import { DEFAULT_ASSET_LOGO_SRC } from '@parts/data/assets';

export const getLogoTemplateByAssetInfo = ({ logo, ticker }: AssetInfo) => {
    let template: string = '';

    if (logo.includes('<svg')) {
        template = logo;
    } else {
        template = `<img alt="${ticker}" src="${logo ?? DEFAULT_ASSET_LOGO_SRC}"/>`;
    }

    return template;
};
