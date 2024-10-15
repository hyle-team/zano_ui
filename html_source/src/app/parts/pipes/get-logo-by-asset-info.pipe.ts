import { inject, Pipe, PipeTransform } from '@angular/core';
import { AssetInfo, VerifiedAssetInfo } from '@api/models/assets.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { defaultImgSrc, zanoAssetInfo } from '@parts/data/assets';
import { VariablesService } from '@parts/services/variables.service';

@Pipe({
    name: 'getLogoByAssetInfo',
    standalone: true
})
export class GetLogoByAssetInfoPipe implements PipeTransform {
    private _variablesService: VariablesService = inject(VariablesService);

    private _sanitizer: DomSanitizer = inject(DomSanitizer);

    transform(value: AssetInfo | VerifiedAssetInfo): string | SafeHtml {
        return this._getLogoByAssetInfo(value);
    }

    private _getLogoByAssetInfo(asset_info: AssetInfo | VerifiedAssetInfo): string | SafeHtml {
        let src: string = defaultImgSrc;
        const alt: string = asset_info.ticker;

        if (zanoAssetInfo.asset_id === asset_info.asset_id) {
            src = zanoAssetInfo.logo;
        }

        let template: string = `<img alt="${alt}" src="${src}"/>`;

        const { verifiedAssetInfoWhitelist$ } = this._variablesService;
        const verifiedAssetsWhitelist = verifiedAssetInfoWhitelist$.value;

        const verifiedAsset = verifiedAssetsWhitelist.find(i => i.asset_id === asset_info.asset_id);

        if (verifiedAsset?.logo) {
            template = verifiedAsset.logo;
        }

        return this._sanitizer.bypassSecurityTrustHtml(template);
    }
}
