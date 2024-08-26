import { Component, inject, OnInit } from '@angular/core';
import { PaginatePipeArgs } from 'ngx-pagination';
import { CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { AssetInfo } from '@api/models/assets.model';
import { VariablesService } from '@parts/services/variables.service';
import { WalletsService } from '@parts/services/wallets.service';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';
import { UpdateCustomAssetComponent } from '../../modals/update-custom-asset/update-custom-asset.component';
import { BurnCustomAssetComponent } from '../../modals/burn-custom-asset/burn-custom-asset.component';
import { EmitCustomAssetComponent } from '../../modals/emit-custom-asset/emit-custom-asset.component';
import { filter } from 'rxjs/operators';
import { TransactionDetailsForCustomAssetsComponent } from '../../modals/transaction-details-for-custom-assets/transaction-details-for-custom-assets.component';
import { Observable, take } from 'rxjs';

@Component({
    selector: 'app-custom-assets',
    templateUrl: './custom-assets.component.html',
    styleUrls: ['./custom-assets.component.scss'],
})
export class CustomAssetsComponent implements OnInit {
    paginationId: string = 'pagination-custom-assets-id';

    triggerOrigin: CdkOverlayOrigin | undefined;

    currentAssetInfo: AssetInfo | undefined;

    isOpenDropDownMenu: boolean = false;

    connectedOverlayPositions: ConnectedPosition[] = [
        {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            offsetY: 30,
        },
    ];
    paginateArgs: PaginatePipeArgs = {
        id: this.paginationId,
        itemsPerPage: 10,
        currentPage: 1,
    };
    private readonly _dialog: Dialog = inject(Dialog);

    private readonly _walletsService: WalletsService = inject(WalletsService);

    public variablesService: VariablesService = inject(VariablesService);

    get assets(): AssetInfo[] {
        return this._walletsService.currentWallet?.assetsInfoWhitelist?.own_assets ?? [];
    }

    get isShowPagination(): boolean {
        const { currentWallet } = this.variablesService;
        if (!currentWallet) {
            return false;
        }
        const {
            assetsInfoWhitelist: { own_assets },
        } = currentWallet;
        return own_assets?.length > this.paginateArgs.itemsPerPage;
    }

    ngOnInit(): void {
        this._loadAssets();
    }

    toggleDropDownMenu(trigger: CdkOverlayOrigin, asset: AssetInfo): void {
        this.isOpenDropDownMenu = !this.isOpenDropDownMenu;
        this.triggerOrigin = trigger;
        this.currentAssetInfo = asset;
    }

    closeDropDownMenu(): void {
        this.isOpenDropDownMenu = false;
    }

    trackByAssets(index: number): number | string {
        return index;
    }

    trackByPages(index: number): number | string {
        return index;
    }

    assetDetails(): void {
        const dialogConfig: DialogConfig = {
            data: {
                asset_info: this.currentAssetInfo,
            },
        };
        this._dialog.open(AssetDetailsComponent, dialogConfig);
    }

    openDialog(type: 'emit' | 'burn' | 'update'): void {
        const dialogConfig: DialogConfig = {
            data: {
                assetInfo: this.currentAssetInfo,
            },
        };

        let closed: Observable<number | undefined>;

        switch (type) {
            case 'emit': {
                closed = this._dialog.open<number | undefined>(EmitCustomAssetComponent, dialogConfig).closed;
                break;
            }
            case 'burn': {
                closed = this._dialog.open<number | undefined>(BurnCustomAssetComponent, dialogConfig).closed;
                break;
            }
            case 'update': {
                closed = this._dialog.open<number | undefined>(UpdateCustomAssetComponent, dialogConfig).closed;
                break;
            }
        }

        closed.pipe(
            filter(job_id => typeof job_id === 'number'),
            take(1),
        )
            .subscribe({
                next: (job_id: number) => {
                    this.details(job_id);
                },
            });
    }

    details(job_id: number): void {
        const dialogConfig: DialogConfig = {
            data: {
                job_id,
            },
        };
        this._dialog
            .open(TransactionDetailsForCustomAssetsComponent, dialogConfig)
            .closed.pipe(filter(Boolean), take(1))
            .subscribe({
                next: () => this._loadAssets(),
            });
    }

    private _loadAssets(): void {
        const {
            currentWallet: { wallet_id },
        } = this._walletsService;
        this._walletsService.loadAssetsWhitelist(wallet_id);
    }
}
