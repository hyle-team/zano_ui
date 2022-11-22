import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletRoutingModule } from './wallet-routing.module';
import { AssetsComponent } from './assets/assets.component';
import { WalletComponent } from './wallet/wallet.component';
import { FlexModule } from '@angular/flex-layout';
import { TooltipModule } from '../../_helpers/directives/tooltip/tooltip.module';
import { ShortStringPipeModule } from '../../_shared/pipes/short-string-pipe/short-string-pipe.module';
import { CopyButtonModule } from '../../_shared/components/copy-button/copy-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { IsAvailableAliasNamePipeModule } from '../../_shared/pipes/is-available-alias-name-pipe/is-available-alias-name-pipe.module';
import { ConfirmModalModule } from '../../_helpers/modals/confirm-modal/confirm-modal.module';
import { AddCustomTokenModule } from '../../_helpers/modals/add-custom-token/add-custom-token.module';
import { ExportHistoryModalModule } from '../../_helpers/modals/export-history-modal/export-history-modal.module';
import { WalletDetailsComponent } from './wallet-details/wallet-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { DefaultImgModule } from '../../_shared/directives/default-img';
import { GetAssetInfoByIdModule } from '../../_shared/pipes/get-asset-info-by-id/get-asset-info-by-id.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [WalletComponent, AssetsComponent, WalletDetailsComponent],
  imports: [
    CommonModule,
    WalletRoutingModule,
    FlexModule,
    TooltipModule,
    ShortStringPipeModule,
    CopyButtonModule,
    TranslateModule,
    IsAvailableAliasNamePipeModule,
    ConfirmModalModule,
    AddCustomTokenModule,
    ExportHistoryModalModule,
    ReactiveFormsModule,
    OverlayModule,
    DefaultImgModule,
    GetAssetInfoByIdModule,
    NgxPaginationModule,
  ],
})
export class WalletModule {}
