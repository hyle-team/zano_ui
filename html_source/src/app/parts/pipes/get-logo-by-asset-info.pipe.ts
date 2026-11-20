import { Pipe, PipeTransform } from '@angular/core';
import { AssetInfo } from '@api/models/assets.model';
import { DEFAULT_ASSET_LOGO_SRC } from '@parts/data/constants';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';

@Pipe({
    name: 'getLogoByAssetInfo',
    standalone: true,
})
export class GetLogoByAssetInfoPipe implements PipeTransform {
    transform({ logo }: AssetInfo): string {
        if (typeof logo !== 'string') {
            return DEFAULT_ASSET_LOGO_SRC;
        }

        if (logo === ZANO_ASSET_INFO.logo || logo === DEFAULT_ASSET_LOGO_SRC) {
            return logo;
        }

        try {
            const inlineSvg = logo.trim();
            if (/^<svg(?=[\s/>])/.test(inlineSvg)) {
                // Check the opening tag only, skipping quoted attribute values.
                const hasDefaultNamespace = /^<svg(?:[^>"']|"[^"]*"|'[^']*')*?\sxmlns\s*=/.test(inlineSvg);
                const svg = hasDefaultNamespace ? inlineSvg : inlineSvg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');

                // Load the SVG in image mode through <img [src]>.
                return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
            }

            const url = new URL(logo);
            return url.protocol === 'https:' ? url.href : DEFAULT_ASSET_LOGO_SRC;
        } catch {
            return DEFAULT_ASSET_LOGO_SRC;
        }
    }
}
