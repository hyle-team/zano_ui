import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetLogoByAssetInfoPipe } from '@parts/pipes/get-logo-by-asset-info.pipe';
import { IntToMoneyPipeModule } from '@parts/pipes';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { VisibilityBalanceDirective } from '@parts/directives/visibility-balance.directive';
import { AssetBalance } from '@api/models/assets.model';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';

@Component({
    selector: 'zano-asset-field',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        GetLogoByAssetInfoPipe,
        IntToMoneyPipeModule,
        IsVisibleControlErrorPipe,
        NgSelectModule,
        ReactiveFormsModule,
        TranslateModule,
        VisibilityBalanceDirective,
    ],
    templateUrl: './asset-field.component.html',
    styleUrls: ['./asset-field.component.scss'],
})
export class AssetFieldComponent {
    @Input('controlRef')
    control: FormControl<string>;

    @Input()
    items: (AssetBalance & { disabled: boolean })[] = [];
}
