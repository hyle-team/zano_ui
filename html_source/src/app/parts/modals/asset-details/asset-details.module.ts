import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { IntToMoneyPipeModule } from '@parts/pipes';

@NgModule({
    declarations: [AssetDetailsComponent],
    exports: [AssetDetailsComponent],
    imports: [CommonModule, TranslateModule, FlexModule, IntToMoneyPipeModule],
})
export class AssetDetailsModule {}
