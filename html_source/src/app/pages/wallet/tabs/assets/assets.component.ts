import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { Subject } from 'rxjs';
import { AssetBalance, ParamsRemoveCustomAssetId } from '@api/models/assets.model';
import { PaginatePipeArgs } from 'ngx-pagination';
import { takeUntil } from 'rxjs/operators';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';
import { BackendService } from '@api/services/backend.service';
import { ConfirmModalComponent, ConfirmModalData } from '@parts/modals/confirm-modal/confirm-modal.component';
import { WalletsService } from '@parts/services/wallets.service';
import { BigNumber } from 'bignumber.js';
import { LOCKED_BALANCE_HELP_PAGE } from '@parts/data/constants';
import { IntToMoneyPipe } from '@parts/pipes';
import { TranslateService } from '@ngx-translate/core';
import { ZANO_ASSET_INFO } from '@parts/data/assets';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-assets',
    templateUrl: `./assets.component.html`
})
export class AssetsComponent implements OnInit, OnDestroy {
    paginatePipeArgs: PaginatePipeArgs = {
        id: 'pagination-assets-id',
        itemsPerPage: 10,
        currentPage: 1
    };

    private readonly _destroy$ = new Subject<void>();

    private readonly _matDialog: MatDialog = inject(MatDialog);

    public readonly variablesService: VariablesService = inject(VariablesService);

    private readonly _backendService: BackendService = inject(BackendService);

    private readonly _walletsService: WalletsService = inject(WalletsService);

    private readonly _intToMoneyPipe: IntToMoneyPipe = inject(IntToMoneyPipe);

    private readonly _translateService: TranslateService = inject(TranslateService);

    private readonly _ngZone: NgZone = inject(NgZone);

    private readonly _router: Router = inject(Router);

    get isShowPagination(): boolean {
        const { current_wallet } = this.variablesService;
        if (current_wallet) {
            const { balances } = current_wallet;
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

    trackByAssets(index: number, { asset_info: { asset_id } }: AssetBalance): number | string {
        return asset_id || index;
    }

    trackByPages(index: number): number | string {
        return index;
    }

    assetDetails(balance: AssetBalance): void {
        const { asset_info } = balance;
        const config: MatDialogConfig = {
            data: {
                asset_info
            }
        };
        this._matDialog.open(AssetDetailsComponent, config);
    }

    beforeRemoveAsset(balance: AssetBalance): void {
        const { full_name } = balance.asset_info;
        const config: MatDialogConfig<ConfirmModalData> = {
            data: {
                title: this._translateService.instant('ASSETS.MODALS.CONFIRM_MODAL.TITLE', { full_name })
            }
        };

        this._matDialog
            .open<ConfirmModalComponent, ConfirmModalData, boolean>(ConfirmModalComponent, config)
            .afterClosed()
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: confirmed => confirmed && this._removeAsset(balance)
            });
    }

    private _removeAsset(balance: AssetBalance): void {
        const { current_wallet, verifiedAssetIdWhitelist } = this.variablesService;
        const { wallet_id, transfer_form_value } = current_wallet;
        const {
            asset_info: { asset_id }
        } = balance;

        const isVerifiedAsset: boolean = verifiedAssetIdWhitelist.includes(asset_id);

        if (isVerifiedAsset) {
            current_wallet.addAssetToLocalBlacklistVerifiedAssets(asset_id);
        } else {
            const params: ParamsRemoveCustomAssetId = {
                wallet_id,
                asset_id
            };

            this._backendService.removeCustomAssetId(params, () => {
                this._ngZone.run(() => {
                    if (transfer_form_value?.asset_id === asset_id) {
                        this._walletsService.currentWallet.transfer_form_value.asset_id = ZANO_ASSET_INFO.asset_id;
                    }

                    this._walletsService.updateWalletInfo(current_wallet);
                });
            });
        }
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

    isShowDeleteAsset(balance: AssetBalance): boolean {
        const {
            asset_info: { asset_id }
        } = balance;
        /** You can't delete zano */
        return ![ZANO_ASSET_INFO.asset_id].includes(asset_id);
    }

    private _listenChangeWallet(): void {
        const { currentWalletChangedEvent } = this.variablesService;
        currentWalletChangedEvent.pipe(takeUntil(this._destroy$)).subscribe({
            next: () => {
                this.paginatePipeArgs.currentPage = 0;
            }
        });
    }

    isWalletReady(): boolean {
        const { current_wallet, daemon_state } = this.variablesService;
        const isWalletLoaded: boolean = current_wallet.loaded;
        const isDaemonReady: boolean = daemon_state === 2;
        const isWalletUsable: boolean = !current_wallet.is_auditable && !current_wallet.is_watch_only;

        return isWalletLoaded && isDaemonReady && isWalletUsable;
    }

    navigateToSend(asset: AssetBalance): void {
        if (this.isWalletReady()) {
            this._router.navigate(['/wallet/send'], { state: { asset } }).then();
        }
    }
}
