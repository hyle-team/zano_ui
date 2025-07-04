import { Component, inject } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { AssetInfo } from '@api/models/assets.model';
import { ZANO_ASSET_INFO, ZanoAssetInfo } from '@parts/data/zano-assets-info';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IntToMoneyPipeModule } from '@parts/pipes';
import { AutoFocusDirective } from '@parts/directives/autofocus.directive';

@Component({
    selector: 'app-asset-details',
    templateUrl: './asset-details.component.html',
    styleUrls: ['./asset-details.component.scss'],
    standalone: true,
    imports: [CommonModule, TranslateModule, IntToMoneyPipeModule, MatDialogModule, AutoFocusDirective],
})
export class AssetDetailsComponent {
    public readonly zanoAssetInfo: ZanoAssetInfo = ZANO_ASSET_INFO;

    public readonly data: { asset_info: AssetInfo; title?: string } = inject(MAT_DIALOG_DATA);

    public readonly variablesService: VariablesService = inject(VariablesService);
}
