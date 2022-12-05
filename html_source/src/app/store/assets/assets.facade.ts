import { Injectable } from '@angular/core';
import { StateKeys, Store } from '@store/store';
import { AssetsService } from '@api/services/assets.service';
import { BehaviorSubject, Observable, take } from 'rxjs';
import {
  WhiteAssetInfo,
  ResponseAssetsWhiteList,
} from '@api/models/assets.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AssetsFacade {
  loading$ = new BehaviorSubject<boolean>(false);

  constructor(private store: Store, private assetsService: AssetsService) {}

  loadAssetsWhitelist(): void {
    this.loading$.next(true);
    this.assetsService
      .assetsWhitelist()
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.store.set(StateKeys.responseAssetsWhiteList, response);
          this.loading$.next(false);
        },
        error: () => {
          this.loading$.next(false);
        },
      });
  }

  getAssetsWhitelist(): Observable<WhiteAssetInfo[]> {
    return this.store
      .select<ResponseAssetsWhiteList>(StateKeys.responseAssetsWhiteList)
      .pipe(map(({ assets }) => assets));
  }

  getAssetsWhitelistById(
    asset_id: string
  ): Observable<WhiteAssetInfo | undefined> {
    return this.getAssetsWhitelist().pipe(
      map(arr => arr.find(i => i.asset_id === asset_id))
    );
  }
}
