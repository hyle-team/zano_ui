import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetTokenCardComponent } from './asset-token-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from '../../../_helpers/directives/tooltip/tooltip.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { DefaultImgModule } from '../../directives/default-img';

@NgModule({
  declarations: [AssetTokenCardComponent],
  exports: [AssetTokenCardComponent],
  imports: [
    CommonModule,
    TranslateModule,
    TooltipModule,
    OverlayModule,
    DefaultImgModule,
  ],
})
export class AssetTokenCardModule {}
