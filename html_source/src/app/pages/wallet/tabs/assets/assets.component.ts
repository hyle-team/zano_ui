import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
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
    paginatePipeArgs: PaginatePipeArgs = {
        id: 'pagination-assets-id',
        itemsPerPage: 10,
        currentPage: 1,
    };

    triggerOrigin!: CdkOverlayOrigin;

    currentAssetBalance!: AssetBalance;

    isOpenDropDownMenu = false;

    private readonly _destroy$ = new Subject<void>();

    private readonly _matDialog: MatDialog = inject(MatDialog);

    public readonly variablesService: VariablesService = inject(VariablesService);

    private readonly _backendService: BackendService = inject(BackendService);

    private readonly _walletsService: WalletsService = inject(WalletsService);

    private readonly _intToMoneyPipe: IntToMoneyPipe = inject(IntToMoneyPipe);

    private readonly _translateService: TranslateService = inject(TranslateService);

    private readonly _ngZone: NgZone = inject(NgZone);

    get isShowPagination(): boolean {
        const { currentWallet } = this.variablesService;
        if (currentWallet) {
            const { balances } = currentWallet;
            return (balances?.length || 0) > this.paginatePipeArgs.itemsPerPage;
        }
        return false;
    }

    ngOnInit(): void {
        this._listenChangeWallet();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    toggleDropDownMenu(trigger: CdkOverlayOrigin, assetBalance: AssetBalance): void {
        this.isOpenDropDownMenu = !this.isOpenDropDownMenu;
        this.triggerOrigin = trigger;
        this.currentAssetBalance = assetBalance;
    }

    trackByAssets(index: number, { asset_info: { asset_id } }: AssetBalance): number | string {
        return asset_id || index;
    }

    trackByPages(index: number): number | string {
        return index;
    }

    assetDetails(): void {
        const { asset_info } = this.currentAssetBalance;
        const config: MatDialogConfig = {
            data: {
                asset_info
            },
        };
        this._matDialog.open(AssetDetailsComponent, config);
    }

    beforeRemoveAsset(): void {
        if (!this.currentAssetBalance) {
            return;
        }
        const { full_name } = this.currentAssetBalance.asset_info;
        const config: MatDialogConfig<ConfirmModalData> = {
            data: {
                // TODO: Add in translates
                title: `Do you want delete "${full_name}"`,
            },
        };

        this._matDialog
            .open<ConfirmModalComponent, ConfirmModalData, boolean>(ConfirmModalComponent, config)
            .afterClosed()
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: confirmed => confirmed && this._removeAsset(),
            });
    }

    private _removeAsset(): void {
        const {
            currentWallet
        } = this.variablesService;
        const { wallet_id, sendMoneyParams } = currentWallet;
        const {
            asset_info: { asset_id },
        } = this.currentAssetBalance;

        const params: ParamsRemoveCustomAssetId = {
            wallet_id,
            asset_id,
        };

        this._backendService.removeCustomAssetId(params, () => {
            this._ngZone.run(() => {
                if (sendMoneyParams?.asset_id === asset_id) {
                    this._walletsService.currentWallet.sendMoneyParams.asset_id = zanoAssetInfo.asset_id;
                }

                this._walletsService.updateWalletInfo(wallet_id);

                this.currentAssetBalance = undefined;
            });
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
            available.innerText = `${this._translateService.instant('WALLET.AVAILABLE_BALANCE')} `;
            const availableB = document.createElement('b');
            availableB.innerText = visibilityBalance
                ? `${this._intToMoneyPipe.transform(unlocked, decimal_point)} ${ticker || '---'}`
                : '******';
            available.appendChild(availableB);
            scrollWrapper.appendChild(available);

            const locked = document.createElement('span');
            locked.setAttribute('class', 'locked');
            locked.innerText = `${this._translateService.instant('WALLET.LOCKED_BALANCE')} `;
            const lockedB = document.createElement('b');
            lockedB.innerText = visibilityBalance
                ? `${this._intToMoneyPipe.transform(new BigNumber(total).minus(unlocked), decimal_point)} ${ticker || '---'}`
                : '******';
            locked.appendChild(lockedB);
            scrollWrapper.appendChild(locked);
        });
        tooltip.appendChild(scrollWrapper);
        const link = document.createElement('span');
        link.setAttribute('class', 'link');
        link.innerHTML = this._translateService.instant('WALLET.LOCKED_BALANCE_LINK');
        link.addEventListener('click', () => {
            this._backendService.openUrlInBrowser(LOCKED_BALANCE_HELP_PAGE);
        });
        tooltip.appendChild(link);
        return tooltip;
    }

    isShowDeleteAsset(): boolean {
        const {
            asset_info: { asset_id },
        } = this.currentAssetBalance;
        const {
            verifiedAssetInfoWhitelist$: { value: verifiedAssetInfoWhitelist },
        } = this.variablesService;
        /**
         * You can't delete asset zano and assets that are in whitelist
         * */
        return ![zanoAssetInfo.asset_id, ...verifiedAssetInfoWhitelist.map(i => i.asset_id)].includes(asset_id);
    }

    private _listenChangeWallet(): void {
        const { currentWalletChangedEvent } = this.variablesService;
        currentWalletChangedEvent.pipe(takeUntil(this._destroy$)).subscribe({
            next: () => {
                this.paginatePipeArgs.currentPage = 0;
            },
        });
    }
}
