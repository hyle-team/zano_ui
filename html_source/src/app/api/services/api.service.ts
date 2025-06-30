import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WrapInfo } from '@api/models/wrap-info';
import { VerifiedAssetInfoWhitelist } from '@api/models/assets.model';
import { CurrentPriceForAsset } from '@api/models/api-zano.models';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private _httpClient = inject(HttpClient);

    getWrapInfo(): Observable<WrapInfo> {
        return this._httpClient.get<WrapInfo>('https://wrapped.zano.org/api2/get_wrap_info');
    }

    getVerifiedAssetInfoWhitelist(type: 'mainnet' | 'testnet'): Observable<{
        assets: VerifiedAssetInfoWhitelist;
        signature: string;
    }> {
        let url: string;
        if (type === 'mainnet') {
            url = 'https://api.zano.org/assets_whitelist.json';
        } else {
            url = 'https://api.zano.org/assets_whitelist_testnet.json';
        }

        return this._httpClient.get<{ assets: VerifiedAssetInfoWhitelist; signature: string }>(url, {
            headers: { 'Cache-Control': 'no-cache' },
        });
    }

    getCurrentPriceForAsset(asset_id: string): Observable<CurrentPriceForAsset & { asset_id: string }> {
        return this._httpClient
            .get<
                CurrentPriceForAsset & {
                    asset_id: string;
                }
            >(`https://explorer.zano.org/api/price?asset_id=${asset_id}`)
            .pipe(
                map((response) => ({ ...response, asset_id })),
                catchError(() =>
                    of({
                        success: false,
                        data: 'Asset not found',
                        asset_id,
                    })
                )
            );
    }
}
