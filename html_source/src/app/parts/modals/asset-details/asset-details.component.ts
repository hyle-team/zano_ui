import { Component, inject } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { AssetInfo } from '@api/models/assets.model';
import { ZanoAssetInfo, ZANO_ASSET_INFO } from '@parts/data/assets';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IntToMoneyPipeModule } from '@parts/pipes';

@Component({
    selector: 'app-asset-details',
    templateUrl: './asset-details.component.html',
    styleUrls: ['./asset-details.component.scss'],
    standalone: true,
    imports: [CommonModule, TranslateModule, IntToMoneyPipeModule, MatDialogModule]
})
export class AssetDetailsComponent {
    public readonly zanoAssetInfo: ZanoAssetInfo = ZANO_ASSET_INFO;

    public readonly data: { asset_info: AssetInfo; title?: string } = inject(MAT_DIALOG_DATA);

    public readonly variablesService: VariablesService = inject(VariablesService);
}
