import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { AssetInfo, AssetsWhitelistAddResponseData, AssetsWhitelistRemoveResponseData } from '@api/models/assets.model';
import { ZANO_ASSET_INFO, ZanoAssetInfo } from '@parts/data/zano-assets-info';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IntToMoneyPipeModule } from '@parts/pipes';
import { AutoFocusDirective } from '@parts/directives/autofocus.directive';
import { MatIconModule } from '@angular/material/icon';
import { BackendService } from '@api/services/backend.service';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { WalletsService } from '@parts/services/wallets.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-asset-details',
    templateUrl: './asset-details.component.html',
    styleUrls: ['./asset-details.component.scss'],
    standalone: true,
    imports: [CommonModule, TranslateModule, IntToMoneyPipeModule, MatDialogModule, AutoFocusDirective, MatIconModule],
})
export class AssetDetailsComponent implements OnInit, OnDestroy {
    assetWhitelistedStateView: 'assetIsWhitelisted' | 'assetIsNotWhitelisted' | 'assetIsWhitelistedGlobally' = null;

    readonly zanoAssetInfo: ZanoAssetInfo = ZANO_ASSET_INFO;

    readonly data: { asset_info: AssetInfo; title?: string } = inject(MAT_DIALOG_DATA);

    readonly variablesService: VariablesService = inject(VariablesService);

    private readonly _backendService = inject(BackendService);

    private readonly _walletsService = inject(WalletsService);

    private readonly _ngZone: NgZone = inject(NgZone);

    private readonly _matDialogRef = inject(MatDialogRef);

    private readonly _destroy$ = new Subject<void>();

    ngOnInit() {
        this.updateAssetWhitelistStateView();

        const { current_wallet } = this.variablesService;

        current_wallet.assetsInfoWhitelist$.pipe(takeUntil(this._destroy$)).subscribe({
            next: () => {
                this.updateAssetWhitelistStateView();
            },
        });
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    private updateAssetWhitelistStateView() {
        const { assetsInfoWhitelist } = this.variablesService.current_wallet;
        const {
            asset_info: { asset_id },
        } = this.data;

        if (ZANO_ASSET_INFO.asset_id === asset_id) {
            this.assetWhitelistedStateView = null;
            return;
        }

        if (assetsInfoWhitelist.global_whitelist.find((assetInfo) => assetInfo.asset_id === asset_id)) {
            this.assetWhitelistedStateView = 'assetIsWhitelistedGlobally';
            return;
        }

        if (assetsInfoWhitelist.local_whitelist.find((assetInfo) => assetInfo.asset_id === asset_id)) {
            this.assetWhitelistedStateView = 'assetIsWhitelisted';
        } else {
            this.assetWhitelistedStateView = 'assetIsNotWhitelisted';
        }
    }

    addAssetToWhitelist() {
        const {
            asset_info: { asset_id },
        } = this.data;
        const { current_wallet } = this.variablesService;
        const { wallet_id } = current_wallet;
        const params: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: 0,
            method: 'assets_whitelist_add',
            params: {
                asset_id,
            },
        };
        this._backendService.call_wallet_rpc([wallet_id, params], (status, response_data: AssetsWhitelistAddResponseData) => {
            this._ngZone.run(() => {
                if (response_data.result.status === 'OK') {
                    this._walletsService.updateWalletInfo(current_wallet);
                }
            });
        });
    }

    removeAssetFromWhitelist() {
        const {
            asset_info: { asset_id },
        } = this.data;
        const { current_wallet } = this.variablesService;
        const { wallet_id } = current_wallet;
        const params: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: 0,
            method: 'assets_whitelist_remove',
            params: {
                asset_id,
            },
        };
        this._backendService.call_wallet_rpc([wallet_id, params], (status, response_data: AssetsWhitelistRemoveResponseData) => {
            this._ngZone.run(() => {
                if (response_data.result.status === 'OK') {
                    this._walletsService.updateWalletInfo(current_wallet);
                }
            });
        });
    }
}
