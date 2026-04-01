import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaginatePipeArgs } from 'ngx-pagination';
import { AssetInfo } from '@api/models/assets.model';
import { VariablesService } from '@parts/services/variables.service';
import { WalletsService } from '@parts/services/wallets.service';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';
import { UpdateCustomAssetComponent } from '../../modals/update-custom-asset/update-custom-asset.component';
import { BurnCustomAssetComponent } from '../../modals/burn-custom-asset/burn-custom-asset.component';
import { EmitCustomAssetComponent } from '../../modals/emit-custom-asset/emit-custom-asset.component';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { TransactionDetailsForCustomAssetsComponent } from '../../modals/transaction-details-for-custom-assets/transaction-details-for-custom-assets.component';
import { Subject, interval } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
    selector: 'app-custom-assets',
    templateUrl: './custom-assets.component.html',
    styleUrls: ['./custom-assets.component.scss'],
})
export class CustomAssetsComponent implements OnInit, OnDestroy {
    readonly skeletonRows = Array.from({ length: 20 });

    readonly paginateArgs: PaginatePipeArgs = {
        id: 'pagination-custom-assets-id',
        itemsPerPage: 10,
        currentPage: 1,
    };
    private readonly _destroy$ = new Subject<void>();

    constructor(
        public readonly variablesService: VariablesService,
        private readonly _matDialog: MatDialog,
        private readonly _walletsService: WalletsService
    ) {}

    get disabledCreateNewAsset(): boolean {
        const { current_wallet, daemon_state } = this.variablesService;
        return !current_wallet?.loaded || daemon_state !== 2;
    }

    get assetInfoItems(): AssetInfo[] {
        return this._walletsService.currentWallet?.assetsInfoWhitelist?.own_assets ?? [];
    }

    get isShowPagination(): boolean {
        const ownAssets = this.variablesService.current_wallet?.assetsInfoWhitelist?.own_assets;
        return (ownAssets?.length ?? 0) > Number(this.paginateArgs.itemsPerPage);
    }

    ngOnInit(): void {
        this._loadAssetsInfoWhitelist();
        interval(5 * 60 * 1000)
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this._loadAssetsInfoWhitelist();
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    trackByIndex(index: number): number | string {
        return index;
    }

    openDialog(type: 'assetDetails' | 'emit' | 'burn' | 'update', asset_info: AssetInfo): void {
        const config: MatDialogConfig = {
            data: {
                asset_info,
            },
        };

        if (type === 'assetDetails') {
            this._matDialog.open(AssetDetailsComponent, config);
            return;
        }

        const componentMap = {
            emit: EmitCustomAssetComponent,
            burn: BurnCustomAssetComponent,
            update: UpdateCustomAssetComponent,
        };

        this._matDialog
            .open(componentMap[type] as any, config)
            .afterClosed()
            .pipe(
                filter((job_id): job_id is number => typeof job_id === 'number'),
                switchMap((job_id) => {
                    const config2: MatDialogConfig = {
                        data: {
                            job_id,
                        },
                    };
                    return this._matDialog
                        .open<TransactionDetailsForCustomAssetsComponent, any, boolean>(TransactionDetailsForCustomAssetsComponent, config2)
                        .afterClosed();
                }),
                filter(Boolean),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: () => this._loadAssetsInfoWhitelist(),
            });
    }

    private _loadAssetsInfoWhitelist(): void {
        const { currentWallet } = this._walletsService;
        if (currentWallet) {
            this._walletsService.loadAssetsInfoWhitelist(currentWallet);
        }
    }
}
