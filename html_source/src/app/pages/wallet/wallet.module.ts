import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletRoutingModule } from './wallet-routing.module';
import { AssetsComponent } from './tabs/assets/assets.component';
import { WalletComponent } from './wallet/wallet.component';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { TooltipModule } from '@parts/directives/tooltip/tooltip.module';
import {
  ContractStatusMessagesPipeModule,
  GetPriceByUrlModule,
  GetWhiteAssetInfoModule,
  GetWhiteAssetPipe,
  HasInAssetsWhitelistModule,
  HistoryTypeMessagesPipeModule,
  IntToMoneyPipeModule,
  IsAvailableAliasNamePipeModule,
  ShortStringPipeModule,
} from '@parts/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmModalModule } from '@parts/modals/confirm-modal/confirm-modal.module';
import { ExportHistoryModalModule } from './wallet/modals/export-history-modal/export-history-modal.module';
import { WalletDetailsComponent } from '../wallet-details/wallet-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { DefaultImgModule, InputValidateModule, LowerCaseDirective } from '@parts/directives';
import { NgxPaginationModule } from 'ngx-pagination';
import { HistoryComponent } from './tabs/history/history.component';
import { StakingComponent } from './tabs/staking/staking.component';
import { ChartModule } from 'angular-highcharts';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReceiveComponent } from './tabs/receive/receive.component';
import { DialogModule } from '@angular/cdk/dialog';
import { SendDetailsModalComponent } from './tabs/send/modals/send-details-modal/send-details-modal.component';
import { SendModalComponent } from './tabs/send/modals/send-modal/send-modal.component';
import { SendComponent } from './tabs/send/send.component';
import { ExportImportComponent } from '../export-import/export-import.component';
import { AssetDetailsModule } from '@parts/modals/asset-details/asset-details.module';
import { CheckboxComponent } from '@parts/components/checkbox.component';
import { CopyButtonComponent } from '@parts/components/copy-button.component';
import { StakingSwitchComponent } from '@parts/components/staking-switch.component';
import { SwitchComponent } from '@parts/components/switch.component';
import { TransactionDetailsComponent } from '@parts/components/transaction-details.component';
import { BreadcrumbsComponent } from '@parts/components/breadcrumbs/breadcrumbs.component';
import { BackButtonComponent } from '@parts/components/back-button/back-button.component';

@NgModule({
  declarations: [
    WalletComponent,
    AssetsComponent,
    WalletDetailsComponent,
    HistoryComponent,
    StakingComponent,
    ReceiveComponent,
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
    TranslateModule,
    IsAvailableAliasNamePipeModule,
    ConfirmModalModule,
    ExportHistoryModalModule,
    ReactiveFormsModule,
    OverlayModule,
    DefaultImgModule,
    NgxPaginationModule,
    SwitchComponent,
    ChartModule,
    NgSelectModule,
    FormsModule,
    FlexLayoutModule,
    StakingSwitchComponent,
    DialogModule,
    IntToMoneyPipeModule,
    ContractStatusMessagesPipeModule,
    HistoryTypeMessagesPipeModule,
    InputValidateModule,
    CheckboxComponent,
    AssetDetailsModule,
    GetWhiteAssetInfoModule,
    GetPriceByUrlModule,
    HasInAssetsWhitelistModule,
    CopyButtonComponent,
    TransactionDetailsComponent,
    LowerCaseDirective,
    GetWhiteAssetPipe,
    BreadcrumbsComponent,
    BackButtonComponent,
  ],
})
export class WalletModule {}
