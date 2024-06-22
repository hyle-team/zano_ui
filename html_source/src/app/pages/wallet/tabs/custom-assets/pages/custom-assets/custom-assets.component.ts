import { Component } from '@angular/core';
import { PaginatePipeArgs } from 'ngx-pagination';
import { CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { AssetInfo } from '@api/models/assets.model';
import { defaultImgSrc, ZanoAssetInfo, zanoAssetInfo } from '@parts/data/assets';
import { VariablesService } from '@parts/services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { WalletsService } from '@parts/services/wallets.service';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { IntToMoneyPipe } from '@parts/pipes';
import { TranslateService } from '@ngx-translate/core';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';
import { UpdateCustomAssetComponent } from '../../modals/update-custom-asset/update-custom-asset.component';
import { BurnCustomAssetComponent } from '../../modals/burn-custom-asset/burn-custom-asset.component';
import { EmitCustomAssetComponent } from '../../modals/emit-custom-asset/emit-custom-asset.component';

@Component({
    selector: 'app-custom-assets',
    templateUrl: './custom-assets.component.html',
    styleUrls: ['./custom-assets.component.scss'],
})
export class CustomAssetsComponent {
    paginationId: string = 'pagination-custom-assets-id';
    zanoAssetInfo: ZanoAssetInfo = zanoAssetInfo;
    defaultImgSrc: string = defaultImgSrc;
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
    get assets(): AssetInfo[] {
        return this.walletsService.currentWallet?.assetsInfoWhitelist?.own_assets ?? [];
    }

    constructor(
        public variablesService: VariablesService,
        private backendService: BackendService,
        public walletsService: WalletsService,
        private dialog: Dialog,
        private intToMoneyPipe: IntToMoneyPipe,
        private translate: TranslateService
    ) {}

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

    details(): void {
        const dialogConfig: DialogConfig = {
            width: '54rem',
            maxWidth: '95vw',
            data: {
                assetInfo: this.currentAssetInfo,
            },
        };
        this.dialog.open(AssetDetailsComponent, dialogConfig);
    }

    update(): void {
        const dialogConfig: DialogConfig = {
            width: '54rem',
            maxWidth: '95vw',
            data: {
                assetInfo: this.currentAssetInfo,
            },
        };
        this.dialog.open(UpdateCustomAssetComponent, dialogConfig);
    }

    emit(): void {
        const dialogConfig: DialogConfig = {
            width: '54rem',
            maxWidth: '95vw',
            data: {
                assetInfo: this.currentAssetInfo,
            },
        };
        this.dialog.open(EmitCustomAssetComponent, dialogConfig);
    }

    burn(): void {
        const dialogConfig: DialogConfig = {
            width: '54rem',
            maxWidth: '95vw',
            data: {
                assetInfo: this.currentAssetInfo,
            },
        };
        this.dialog.open(BurnCustomAssetComponent, dialogConfig);
    }
}
