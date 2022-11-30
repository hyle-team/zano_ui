import { Component, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { Subject } from 'rxjs';
import { Asset } from '@api/models/assets.model';
import { Store } from '@store/store';
import { PaginatePipeArgs } from 'ngx-pagination';
import { takeUntil } from 'rxjs/operators';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AssetDetailsComponent } from './modals/asset-details/asset-details.component';
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
    const { currentWallet } = this.variablesService;
    if (currentWallet) {
      const { balances } = currentWallet;
      return (balances?.length || 0) > this.itemsPerPage;
    }
    return false;
  }

  triggerOrigin!: CdkOverlayOrigin;

  currentAsset!: Asset;

  isOpenDropDownMenu = false;

  defaultImgSrc = 'assets/icons/currency-icons/custom_token.svg';

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

  toggleDropDownMenu(trigger: CdkOverlayOrigin, asset: Asset): void {
    this.isOpenDropDownMenu = !this.isOpenDropDownMenu;
    if (this.isOpenDropDownMenu) {
      this.triggerOrigin = trigger;
      this.currentAsset = asset;
    } else {
      this.triggerOrigin = undefined;
      this.currentAsset = undefined;
    }
  }

  trackByAssets(
    index: number,
    { asset_info: { asset_id } }: Asset
  ): number | string {
    return asset_id || index;
  }

  trackByPages(index: number): number | string {
    return index;
  }

  assetDetails(): void {
    const config = {
      data: {
        asset: this.currentAsset,
      },
    };
    this.dialog.open(AssetDetailsComponent, config);
  }

  removeAsset(): void {
    // TODO: add functionality
    return;
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
