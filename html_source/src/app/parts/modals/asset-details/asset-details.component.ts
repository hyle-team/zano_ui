import { Component, inject, Inject, NgZone, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { VariablesService } from '@parts/services/variables.service';
import { Asset } from '@api/models/assets.model';
import { zanoAssetInfo } from '@parts/data/assets';
import { BackendService } from '@api/services/backend.service';
import { ParamsCallRpc } from '@api/models/call_rpc.model';

@Component({
    selector: 'app-asset-details',
    template: `
        <div class="p-2 border-radius-0_8-rem bg-light-blue w-100 max-h-90-vh" fxFlex="0 1 54rem">
            <div class="overflow-hidden" fxFlexFill fxLayout="column">
                <h3 class="title mb-2" fxFlex="0 0 auto">
                    {{ title | translate }}
                </h3>
                <ng-container *ngIf="asset; else templateEmpty">
                    <div class="content mb-2 w-100 overflow-x-hidden overflow-y-auto" fxFlex="1 1 auto">
                        <div class="table-info">
                            <div class="row">
                                <div class="label max-w-19-rem w-100">
                                    {{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.NAME' | translate }}
                                </div>
                                <div class="text">{{ asset.asset_info.full_name }}</div>
                            </div>

                            <hr class="separator" />

                            <div class="row">
                                <div class="label max-w-19-rem w-100">
                                    {{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.TICKER' | translate }}
                                </div>
                                <div class="text">{{ asset.asset_info.ticker }}</div>
                            </div>

                            <hr class="separator" />

                            <div class="row">
                                <div class="label max-w-19-rem w-100">
                                    {{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.ID' | translate }}
                                </div>
                                <div class="text" (contextmenu)="variablesService.onContextMenuOnlyCopy($event, asset.asset_info.asset_id)">
                                    {{ asset.asset_info.asset_id }}
                                </div>
                            </div>

                            <hr class="separator" />

                            <div class="row">
                                <div class="label max-w-19-rem w-100">
                                    {{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.CURRENT_SUPPLY' | translate }}
                                </div>
                                <div class="text">
                                    {{
                                        asset.asset_info.asset_id === zanoAssetInfo.asset_id
                                            ? zano_current_supply
                                            : asset.asset_info.current_supply
                                    }}
                                </div>
                            </div>

                            <hr class="separator" />

                            <div class="row">
                                <div class="label max-w-19-rem w-100">
                                    {{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.MAX_SUPPLE' | translate }}
                                </div>
                                <div class="text">
                                    {{
                                        asset.asset_info.asset_id === zanoAssetInfo.asset_id
                                            ? 'Uncapped'
                                            : asset.asset_info.total_max_supply
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-container>
                <ng-template #templateEmpty> No data</ng-template>
                <div class="controls w-100" fxFlex="0 0 auto" fxLayout="row nowrap" fxLayoutGap="1rem">
                    <button (click)="close()" class="outline big w-100" type="button">
                        {{ 'MODALS.OK' | translate }}
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                max-width: 54rem;
                width: 100vw;
                display: block;
            }
        `,
    ],
})
export class AssetDetailsComponent implements OnInit {
    title = 'Asset Details';

    asset!: Asset;

    zanoAssetInfo = zanoAssetInfo;

    backendService = inject(BackendService);

    ngZone = inject(NgZone);

    zano_current_supply = 'Unknown';

    constructor(
        public variablesService: VariablesService,
        private dialogRef: DialogRef,
        @Inject(DIALOG_DATA) { asset, title }: { asset: Asset; title?: string }
    ) {
        this.asset = asset;

        if (title) {
            this.title = title;
        }
    }

    ngOnInit(): void {
        if (this.asset.asset_info.asset_id === zanoAssetInfo.asset_id) {
            this.getZanoCurrentSupply();
        }
    }

    private getZanoCurrentSupply(): void {
        const { wallet_id } = this.variablesService.currentWallet;
        const params1: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: wallet_id,
            method: 'mw_select_wallet',
            params: { wallet_id },
        };
        const params2: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: wallet_id,
            method: 'getinfo',
            params: {
                flags: 1024,
            },
        };

        this.backendService.call_rpc(params1, (status1, response_data1) => {
            if (response_data1?.result?.status === 'OK') {
                this.backendService.call_rpc(params2, (status2, response_data2) => {
                    this.ngZone.run(() => {
                        this.zano_current_supply = response_data2?.['result']?.['total_coins'] ?? 'Unknown';
                    });
                });
            }
        });
    }

    close(): void {
        this.dialogRef.close();
    }
}
