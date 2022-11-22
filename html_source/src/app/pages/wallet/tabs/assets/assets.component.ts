import { Component, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@zano-helpers/services/variables.service';
import { Observable, Subject } from 'rxjs';
import { Asset, AssetsInfo } from '@zano-helpers/models/assets';
import { StateKeys, Store } from 'store';
import { PaginatePipeArgs } from 'ngx-pagination';
import { takeUntil } from 'rxjs/operators';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AssetDetailsComponent } from './dialogs/asset-details/asset-details.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements OnInit, OnDestroy {
  currentPage = 1;

  itemsPerPage = 10;

  paginationId = 'pagination-assets-id';

  get paginatePipeArgs(): PaginatePipeArgs {
    return {
      id: this.paginationId,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
    };
  }

  get isShowPagination(): boolean {
    return (
      this.variablesService.currentWallet.assets.length > this.itemsPerPage
    );
  }

  triggerOrigin!: CdkOverlayOrigin;

  isOpenDropDownMenu = false;

  defaultImgSrc = 'assets/icons/currency-icons/custom_token.svg';

  get assetsInfo$(): Observable<AssetsInfo | null | undefined> {
    return this.store.select<AssetsInfo | null | undefined>(
      StateKeys.assetsInfo
    );
  }

  private destroy$ = new Subject<void>();

  constructor(
    public variablesService: VariablesService,
    private store: Store,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    this.listenChangeWallet();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDropDownMenu(trigger: CdkOverlayOrigin): void {
    this.triggerOrigin = trigger;
    this.isOpenDropDownMenu = !this.isOpenDropDownMenu;
  }

  trackByAssets(index: number, { asset_id }: Asset): number | string {
    return asset_id || index;
  }

  trackByPages(index: number): number | string {
    return index;
  }

  assetDetails(): void {
    this.dialog.open(AssetDetailsComponent);
  }

  private listenChangeWallet(): void {
    this.variablesService.getWalletChangedEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.currentPage = 0;
        },
      });
  }
}
