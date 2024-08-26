import { Component, inject, Inject, NgZone } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { VariablesService } from '@parts/services/variables.service';
import { AssetInfo } from '@api/models/assets.model';
import { ZanoAssetInfo, zanoAssetInfo } from '@parts/data/assets';
import { BackendService } from '@api/services/backend.service';

@Component({
    selector: 'app-asset-details',
    template: `
        <div class="p-2 border-radius-0_8-rem bg-light-blue w-100 max-h-90-vh" fxFlex="0 1 54rem">
            <div class="overflow-hidden" fxFlexFill fxLayout="column">
                <h3 class="title mb-2" fxFlex="0 0 auto">
                    {{ title | translate }}
                </h3>
                <ng-container *ngIf="asset_info; else templateEmpty">
                    <div class="content mb-2 w-100 overflow-x-hidden overflow-y-auto" fxFlex="1 1 auto">
                        <table class="rounded-corners">
                            <tbody>
                                <tr>
                                    <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.NAME' | translate }}</td>
                                    <td>{{ asset_info.full_name }}</td>
                                </tr>
                                <tr>
                                    <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.TICKER' | translate }}</td>
                                    <td>{{ asset_info.ticker }}</td>
                                </tr>
                                <tr>
                                    <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.OWNER' | translate }}</td>
                                    <td (contextmenu)="variablesService.onContextMenuOnlyCopy($event, asset_info.owner)">
                                        {{ asset_info.owner }}
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.ID' | translate }}</td>
                                    <td (contextmenu)="variablesService.onContextMenuOnlyCopy($event, asset_info.asset_id)">
                                        {{ asset_info.asset_id }}
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.CURRENT_SUPPLY' | translate }}</td>
                                    <td>
                                        {{
                                            (asset_info.asset_id === zanoAssetInfo.asset_id
                                                ? variablesService.zano_current_supply ?? 'Unknown'
                                                : asset_info.current_supply
                                            ) | intToMoney : asset_info.decimal_point
                                        }}
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{ 'ASSETS.MODALS.ASSET_DETAILS.LABELS.MAX_SUPPLE' | translate }}</td>
                                    <td>
                                        {{
                                            asset_info.asset_id === zanoAssetInfo.asset_id
                                                ? 'Uncapped'
                                                : (asset_info.total_max_supply | intToMoney : asset_info.decimal_point)
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
export class AssetDetailsComponent {
    title: string = 'Asset Details';

    asset_info: AssetInfo;

    zanoAssetInfo: ZanoAssetInfo = zanoAssetInfo;

    backendService: BackendService = inject(BackendService);

    ngZone: NgZone = inject(NgZone);

    constructor(
        public variablesService: VariablesService,
        private dialogRef: DialogRef,
        @Inject(DIALOG_DATA) { asset_info, title }: { asset_info: AssetInfo; title?: string }
    ) {
        this.asset_info = asset_info;

        if (title) {
            this.title = title;
        }
    }

    close(): void {
        this.dialogRef.close();
    }
}
