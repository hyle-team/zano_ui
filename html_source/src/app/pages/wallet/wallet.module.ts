import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletRoutingModule } from './wallet-routing.module';
import { AssetsComponent } from './tabs/assets/assets.component';
import { WalletComponent } from './wallet/wallet.component';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { TooltipModule } from '@parts/directives/tooltip/tooltip.module';
import { ShortStringPipeModule } from '../../parts/pipes/short-string-pipe/short-string-pipe.module';
import { CopyButtonModule } from '../../parts/components/copy-button/copy-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { IsAvailableAliasNamePipeModule } from '../../parts/pipes/is-available-alias-name-pipe/is-available-alias-name-pipe.module';
import { ConfirmModalModule } from '@parts/modals/confirm-modal/confirm-modal.module';
import { AddCustomTokenModule } from './wallet/modals/add-custom-token/add-custom-token.module';
import { ExportHistoryModalModule } from './wallet/modals/export-history-modal/export-history-modal.module';
import { WalletDetailsComponent } from '../wallet-details/wallet-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { DefaultImgModule } from '../../parts/directives/default-img';
import { GetAssetInfoByIdModule } from '../../parts/pipes/get-asset-info-by-id/get-asset-info-by-id.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { HistoryComponent } from './tabs/history/history.component';
import { PipesModule } from '@parts/pipes/pipes.module';
import { TransactionDetailsModule } from '@parts/directives/transaction-details/transaction-details.module';
import { StakingComponent } from './tabs/staking/staking.component';
import { ChartModule } from 'angular-highcharts';
import { NgSelectModule } from '@ng-select/ng-select';
import { StakingSwitchModule } from '@parts/directives/staking-switch/staking-switch.module';
import { ReceiveComponent } from './tabs/receive/receive.component';
import { ContractsComponent } from './tabs/contracts/contracts.component';
import { ContractsTabComponent } from './tabs/contracts/contracts-tab/contracts-tab.component';
import { AssetDetailsComponent } from './tabs/assets/modals/asset-details/asset-details.component';
import { DialogModule } from '@angular/cdk/dialog';
import { SendDetailsModalComponent } from './tabs/send/modals/send-details-modal/send-details-modal.component';
import { SendModalComponent } from './tabs/send/modals/send-modal/send-modal.component';
import { SendComponent } from './tabs/send/send.component';
import { ExportImportComponent } from '../export-import/export-import.component';
import { SwitchModule } from '../../parts/components/switch/switch.module';

@NgModule({
  declarations: [
    WalletComponent,
    AssetsComponent,
    WalletDetailsComponent,
    HistoryComponent,
    StakingComponent,
    ReceiveComponent,
    ContractsComponent,
    ContractsTabComponent,
    AssetDetailsComponent,
    ExportImportComponent,
    SendDetailsModalComponent,
    SendModalComponent,
    SendComponent,
  ],
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
    SwitchModule,
    PipesModule,
    TransactionDetailsModule,
    ChartModule,
    NgSelectModule,
    FormsModule,
    FlexLayoutModule,
    StakingSwitchModule,
    DialogModule,
  ],
})
export class WalletModule {}
