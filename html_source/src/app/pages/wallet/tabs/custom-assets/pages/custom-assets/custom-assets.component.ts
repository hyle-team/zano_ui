import { Component, inject, OnInit } from '@angular/core';
import { PaginatePipeArgs } from 'ngx-pagination';
import { CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { AssetInfo } from '@api/models/assets.model';
import { VariablesService } from '@parts/services/variables.service';
import { WalletsService } from '@parts/services/wallets.service';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';
import { UpdateCustomAssetComponent } from '../../modals/update-custom-asset/update-custom-asset.component';
import { BurnCustomAssetComponent } from '../../modals/burn-custom-asset/burn-custom-asset.component';
import { EmitCustomAssetComponent } from '../../modals/emit-custom-asset/emit-custom-asset.component';
import { filter, switchMap } from 'rxjs/operators';
import { TransactionDetailsForCustomAssetsComponent } from '../../modals/transaction-details-for-custom-assets/transaction-details-for-custom-assets.component';
import { Observable, take } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
    selector: 'app-custom-assets',
    templateUrl: './custom-assets.component.html',
    styleUrls: ['./custom-assets.component.scss']
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
            offsetY: 30
        }
    ];
    paginateArgs: PaginatePipeArgs = {
        id: this.paginationId,
        itemsPerPage: 10,
        currentPage: 1
    };

    public variablesService: VariablesService = inject(VariablesService);

    private readonly _matDialog: MatDialog = inject(MatDialog);

    private readonly _walletsService: WalletsService = inject(WalletsService);

    get assets(): AssetInfo[] {
        return this._walletsService.currentWallet?.assetsInfoWhitelist?.own_assets ?? [];
    }

    get isShowPagination(): boolean {
        const { current_wallet } = this.variablesService;
        if (!current_wallet) {
            return false;
        }
        const {
            assetsInfoWhitelist: { own_assets }
        } = current_wallet;
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

    openDialog(type: 'assetDetails' | 'emit' | 'burn' | 'update'): void {
        const config: MatDialogConfig = {
            data: {
                asset_info: this.currentAssetInfo
            }
        };

        let closed: Observable<number | undefined>;

        switch (type) {
            case 'assetDetails': {
                this._matDialog.open(AssetDetailsComponent, config);
                return;
            }
            case 'emit': {
                closed = this._matDialog
                    .open<EmitCustomAssetComponent, any, number | undefined>(EmitCustomAssetComponent, config)
                    .afterClosed();
                break;
            }
            case 'burn': {
                closed = this._matDialog
                    .open<BurnCustomAssetComponent, any, number | undefined>(BurnCustomAssetComponent, config)
                    .afterClosed();
                break;
            }
            case 'update': {
                closed = this._matDialog
                    .open<UpdateCustomAssetComponent, any, number | undefined>(UpdateCustomAssetComponent, config)
                    .afterClosed();
                break;
            }
        }

        closed
            .pipe(
                filter(job_id => typeof job_id === 'number'),
                switchMap(job_id => {
                    const config2: MatDialogConfig = {
                        data: {
                            job_id
                        }
                    };
                    return this._matDialog
                        .open<TransactionDetailsForCustomAssetsComponent, any, boolean>(TransactionDetailsForCustomAssetsComponent, config2)
                        .afterClosed();
                }),
                filter(Boolean),
                take(1)
            )
            .subscribe({
                next: () => this._loadAssets()
            });
    }

    private _loadAssets(): void {
        const {
            currentWallet: { wallet_id }
        } = this._walletsService;
        this._walletsService.loadAssetsInfoWhitelist(wallet_id);
    }
}
