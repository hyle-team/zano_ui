import { inject, Pipe, PipeTransform } from '@angular/core';
import { AssetInfo } from '@api/models/assets.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { defaultImgSrc, zanoAssetInfo } from '@parts/data/assets';
import { VariablesService } from '@parts/services/variables.service';

@Pipe({
    name: 'getAssetLogo',
    standalone: true
})
export class GetAssetLogoPipe implements PipeTransform {
    private _variablesService: VariablesService = inject(VariablesService);

    private _sanitizer: DomSanitizer = inject(DomSanitizer);

    transform(value: AssetInfo): string | SafeHtml {
        return this._getLogo(value);
    }

    private _getLogo(asset_info: AssetInfo): string | SafeHtml {
        let src: string = defaultImgSrc;
        const alt: string = asset_info.ticker;

        if (zanoAssetInfo.asset_id === asset_info.asset_id) {
            src = zanoAssetInfo.logo;
        }

        let template: string = `<img alt="${alt}" src="${src}"/>`;

        const { verifiedAssetsWhitelist } = this._variablesService;

        const verifiedAsset = verifiedAssetsWhitelist.find(i => i.asset_id === asset_info.asset_id);

        if (verifiedAsset && verifiedAsset.logo) {
            template = verifiedAsset.logo;
        }

        return this._sanitizer.bypassSecurityTrustHtml(template);
    }
}
