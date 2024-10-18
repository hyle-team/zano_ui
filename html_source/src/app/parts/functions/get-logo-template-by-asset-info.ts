import { AssetInfo } from '@api/models/assets.model';
import { defaultAssetLogoSrc } from '@parts/data/assets';

export const getLogoTemplateByAssetInfo = ({ logo, ticker }: AssetInfo) => {
    let template: string = '';

    if (logo.includes('<svg')) {
        template = logo;
    } else {
        template = `<img alt="${ticker}" src="${logo ?? defaultAssetLogoSrc}"/>`;
    }

    return template;
};
