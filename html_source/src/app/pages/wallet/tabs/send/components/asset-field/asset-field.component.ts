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
export class AssetFieldComponent implements OnChanges {
    @Input()
    control_ref: FormControl<string>;

    @Input()
    balances: AssetBalance[] = [];

    @Input()
    is_visible_wrap_info = false;

    items: (AssetBalance & { disabled: boolean })[] = [];

    ngOnChanges(): void {
        const disabled = this.is_visible_wrap_info;
        this.items = this.balances.map((balance: AssetBalance) => prepareAssetBalanceToItem(balance, disabled));
    }
}

const prepareAssetBalanceToItem = (balance: AssetBalance, disabled: boolean): AssetBalance & { disabled: boolean } => {
    const {
        asset_info: { asset_id },
    } = balance;

    if (asset_id === ZANO_ASSET_INFO.asset_id) {
        return { ...balance, disabled: false };
    }

    return { ...balance, disabled };
};
