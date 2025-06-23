import { inject, Pipe, PipeTransform } from '@angular/core';
import { AssetInfo } from '@api/models/assets.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getLogoTemplateByAssetInfo } from '@parts/functions/get-logo-template-by-asset-info';

@Pipe({
    name: 'getLogoByAssetInfo',
    standalone: true,
})
export class GetLogoByAssetInfoPipe implements PipeTransform {
    private _sanitizer: DomSanitizer = inject(DomSanitizer);

    transform(value: AssetInfo): string | SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(getLogoTemplateByAssetInfo(value));
    }
}
