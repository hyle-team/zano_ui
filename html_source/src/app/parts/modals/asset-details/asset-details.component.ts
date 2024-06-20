import { Component, inject, Inject, NgZone, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { VariablesService } from '@parts/services/variables.service';
import { AssetInfo } from '@api/models/assets.model';
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
                <ng-container *ngIf="assetInfo; else templateEmpty">
                    <div class="content mb-2 w-100 overflow-x-hidden overflow-y-auto" fxFlex="1 1 auto">
                        <table class="rounded-corners">
                            <tbody>
                            <tr>
                                <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.NAME' | translate }}</td>
                                <td>{{ assetInfo.full_name }}</td>
                            </tr>
                            <tr>
                                <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.TICKER' | translate }}</td>
                                <td>{{ assetInfo.ticker }}</td>
                            </tr>
                            <tr>
                                <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.OWNER' | translate }}</td>
                                <td (contextmenu)="variablesService.onContextMenuOnlyCopy($event, assetInfo.owner)">{{ assetInfo.owner }}</td>
                            </tr>
                            <tr>
                                <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.ID' | translate }}</td>
                                <td (contextmenu)="variablesService.onContextMenuOnlyCopy($event, assetInfo.asset_id)">{{ assetInfo.asset_id }}</td>
                            </tr>
                            <tr>
                                <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.CURRENT_SUPPLY' | translate }}</td>
                                <td>{{
                                        assetInfo.asset_id === zanoAssetInfo.asset_id
                                            ? (zano_current_supply | intToMoney: zanoAssetInfo.decimal_point)
                                            : (assetInfo.current_supply | intToMoney: assetInfo.decimal_point)
                                    }}
                                </td>
                            </tr>
                            <tr>
                                <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.MAX_SUPPLE' | translate }}</td>
                                <td>
                                    {{
                                        assetInfo.asset_id === zanoAssetInfo.asset_id
                                            ? 'Uncapped'
                                            : assetInfo.total_max_supply | intToMoney: assetInfo.decimal_point
                                    }}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </ng-container>
                <ng-template #templateEmpty>No data</ng-template>
                <div class="controls w-100" fxFlex="0 0 auto" fxLayout="row nowrap" fxLayoutGap="1rem">
                    <button (click)="close()" class="outline big w-100" type="button">
                        {{ 'MODALS.OK' | translate }}
                    </button>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./asset-details.component.scss'],
})
export class AssetDetailsComponent implements OnInit {
    title = 'Asset Details';

    assetInfo!: AssetInfo;

    zanoAssetInfo = zanoAssetInfo;

    backendService = inject(BackendService);

    ngZone = inject(NgZone);

    zano_current_supply = 'Unknown';

    constructor(
        public variablesService: VariablesService,
        private dialogRef: DialogRef,
        @Inject(DIALOG_DATA) { assetInfo, title }: { assetInfo: AssetInfo; title?: string }
    ) {
        this.assetInfo = assetInfo;

        if (title) {
            this.title = title;
        }
    }

    ngOnInit(): void {
        if (this.assetInfo.asset_id === zanoAssetInfo.asset_id) {
            this.getZanoCurrentSupply();
        }
    }

    private getZanoCurrentSupply(): void {
        const params: ParamsCallRpc = {
            jsonrpc: '2.0',
            id: 0,
            method: 'getinfo',
            params: {
                flags: 1024,
            },
        };

        this.backendService.call_rpc(params, (status, response_data) => {
            this.ngZone.run(() => {
                this.zano_current_supply = response_data?.['result']?.['total_coins'] ?? 'Unknown';
            });
        });
    }

    close(): void {
        this.dialogRef.close();
    }
}
