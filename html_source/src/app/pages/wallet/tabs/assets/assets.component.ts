import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { Subject } from 'rxjs';
import { AssetBalance, ParamsRemoveCustomAssetId } from '@api/models/assets.model';
import { PaginatePipeArgs } from 'ngx-pagination';
import { takeUntil } from 'rxjs/operators';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';
import { BackendService } from '@api/services/backend.service';
import { ConfirmModalComponent, ConfirmModalData } from '@parts/modals/confirm-modal/confirm-modal.component';
import { WalletsService } from '@parts/services/wallets.service';
import { BigNumber } from 'bignumber.js';
import { LOCKED_BALANCE_HELP_PAGE } from '@parts/data/constants';
import { IntToMoneyPipe } from '@parts/pipes';
import { TranslateService } from '@ngx-translate/core';
import { zanoAssetInfo } from '@parts/data/assets';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
    selector: 'app-assets',
    templateUrl: `./assets.component.html`,
})
export class AssetsComponent implements OnInit, OnDestroy {
    currentPage = 1;

    itemsPerPage = 10;

    paginationId = 'pagination-assets-id';

    zanoAssetInfo = zanoAssetInfo;

    triggerOrigin!: CdkOverlayOrigin;

    currentAsset!: AssetBalance;

    isOpenDropDownMenu = false;

    private destroy$ = new Subject<void>();

    private readonly _matDialog: MatDialog = inject(MatDialog);

    constructor(
        public variablesService: VariablesService,
        private backendService: BackendService,
        private walletsService: WalletsService,
        private intToMoneyPipe: IntToMoneyPipe,
        private translate: TranslateService
    ) {}

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

    ngOnInit(): void {
        this.listenChangeWallet();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleDropDownMenu(trigger: CdkOverlayOrigin, asset: AssetBalance): void {
        this.isOpenDropDownMenu = !this.isOpenDropDownMenu;
        this.triggerOrigin = trigger;
        this.currentAsset = asset;
    }

    trackByAssets(index: number, { asset_info: { asset_id } }: AssetBalance): number | string {
        return asset_id || index;
    }

    trackByPages(index: number): number | string {
        return index;
    }

    assetDetails(): void {
        const config: MatDialogConfig = {
            data: {
                assetInfo: this.currentAsset.asset_info,
            },
        };
        this._matDialog.open(AssetDetailsComponent, config);
    }

    beforeRemoveAsset(): void {
        if (!this.currentAsset) {
            return;
        }
        const { full_name } = this.currentAsset.asset_info;
        const config: MatDialogConfig<ConfirmModalData> = {
            data: {
                title: `Do you want delete "${full_name}"`,
            },
        };

        this._matDialog
            .open<ConfirmModalComponent, ConfirmModalData, boolean>(ConfirmModalComponent, config)
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: confirmed => confirmed && this.removeAsset(),
            });
    }

    removeAsset(): void {
        const { wallet_id, sendMoneyParams } = this.variablesService.currentWallet;
        const { asset_id } = this.currentAsset.asset_info;
        const params: ParamsRemoveCustomAssetId = {
            wallet_id,
            asset_id,
        };
        this.backendService.removeCustomAssetId(params, () => {
            this.walletsService.updateWalletInfo(wallet_id);
            this.currentAsset = undefined;

            if (sendMoneyParams) {
                this.walletsService.currentWallet.sendMoneyParams.asset_id = zanoAssetInfo.asset_id;
            }
        });
    }

    getBalanceTooltip(balance: AssetBalance): HTMLDivElement {
        const tooltip = document.createElement('div');
        const scrollWrapper = document.createElement('div');
        const visibilityBalance = this.variablesService.visibilityBalance$.value;

        if (!balance) {
            return null;
        }

        scrollWrapper.classList.add('balance-scroll-list');
        [balance].forEach(({ unlocked, total, asset_info: { ticker, decimal_point } }: AssetBalance) => {
            const available = document.createElement('span');
            available.setAttribute('class', 'available');
            available.innerText = `${this.translate.instant('WALLET.AVAILABLE_BALANCE')} `;
            const availableB = document.createElement('b');
            availableB.innerText = visibilityBalance
                ? `${this.intToMoneyPipe.transform(unlocked, decimal_point)} ${ticker || '---'}`
                : '******';
            available.appendChild(availableB);
            scrollWrapper.appendChild(available);

            const locked = document.createElement('span');
            locked.setAttribute('class', 'locked');
            locked.innerText = `${this.translate.instant('WALLET.LOCKED_BALANCE')} `;
            const lockedB = document.createElement('b');
            lockedB.innerText = visibilityBalance
                ? `${this.intToMoneyPipe.transform(new BigNumber(total).minus(unlocked), decimal_point)} ${ticker || '---'}`
                : '******';
            locked.appendChild(lockedB);
            scrollWrapper.appendChild(locked);
        });
        tooltip.appendChild(scrollWrapper);
        const link = document.createElement('span');
        link.setAttribute('class', 'link');
        link.innerHTML = this.translate.instant('WALLET.LOCKED_BALANCE_LINK');
        link.addEventListener('click', () => {
            this.backendService.openUrlInBrowser(LOCKED_BALANCE_HELP_PAGE);
        });
        tooltip.appendChild(link);
        return tooltip;
    }

    private listenChangeWallet(): void {
        this.variablesService.currentWalletChangedEvent.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.currentPage = 0;
            },
        });
    }
}
