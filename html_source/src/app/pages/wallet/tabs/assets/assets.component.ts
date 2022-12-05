import { Component, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { Subject } from 'rxjs';
import { Asset, ParamsRemoveCustomAssetId } from '@api/models/assets.model';
import { Store } from '@store/store';
import { PaginatePipeArgs } from 'ngx-pagination';
import { takeUntil } from 'rxjs/operators';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AssetDetailsComponent } from '../../../../parts/modals/asset-details/asset-details.component';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { BackendService } from '@api/services/backend.service';
import {
  ConfirmModalComponent,
  ConfirmModalData,
} from '@parts/modals/confirm-modal/confirm-modal.component';

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
    private backendService: BackendService,
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
    this.triggerOrigin = trigger;
    this.currentAsset = asset;
  }

  trackByPages(index: number): number | string {
    return index;
  }

  assetDetails(): void {
    const dialogConfig: DialogConfig = {
      data: {
        asset: this.currentAsset,
      },
    };
    this.dialog.open(AssetDetailsComponent, dialogConfig);
  }

  beforeRemoveAsset(): void {
    if (!this.currentAsset) {
      return;
    }
    const {
      asset_info: { full_name },
    } = this.currentAsset;
    const dialogConfig: DialogConfig<ConfirmModalData> = {
      data: {
        title: `Do you want delete "${full_name || '---'}"`,
      },
    };

    this.dialog
      .open<boolean>(ConfirmModalComponent, dialogConfig)
      .closed.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: confirmed => confirmed && this.removeAsset(),
      });
  }

  removeAsset(): void {
    const { wallet_id } = this.variablesService.currentWallet;
    const {
      asset_info: { asset_id },
    } = this.currentAsset;
    const params: ParamsRemoveCustomAssetId = {
      wallet_id,
      asset_id,
    };
    this.backendService.removeCustomAssetId(params, () => {
      this.currentAsset = undefined;
    });
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
