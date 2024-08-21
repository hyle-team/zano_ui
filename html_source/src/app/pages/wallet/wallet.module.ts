import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletRoutingModule } from './wallet-routing.module';
import { AssetsComponent } from './tabs/assets/assets.component';
import { WalletComponent } from './wallet/wallet.component';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { TooltipModule } from '@parts/directives/tooltip/tooltip.module';
import {
    ContractStatusMessagesPipeModule,
    HistoryTypeMessagesPipeModule,
    IntToMoneyPipeModule,
    IsAvailableAliasNamePipeModule,
    ShortStringPipe,
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
import { SendComponent } from './tabs/send/send.component';
import { ExportImportComponent } from '../export-import/export-import.component';
import { CheckboxComponent } from '@parts/components/checkbox.component';
import { CopyButtonComponent } from '@parts/components/copy-button.component';
import { StakingSwitchComponent } from '@parts/components/staking-switch.component';
import { SwitchComponent } from '@parts/components/switch.component';
import { BreadcrumbsComponent } from '@parts/components/breadcrumbs/breadcrumbs.component';
import { BackButtonComponent } from '@parts/components/back-button/back-button.component';
import { WalletModalsModule } from './tabs/send/modals/wallet-modals.module';
import { GetAssetInfoPipe } from '@parts/pipes/get-asset-info.pipe';
import { MigrateWalletToZarcanumComponent } from './wallet/modals/migrate-wallet-to-zarcanum/migrate-wallet-to-zarcanum.component';
import { SuccessSweepBareOutsComponent } from './wallet/modals/success-sweep-bare-outs/success-sweep-bare-outs.component';
import { GetAmountItemsPipe } from '@parts/pipes/get-amount-items.pipe';
import { TransactionStatusComponent } from '@parts/components/transaction-status/transaction-status.component';
import { IsVisibleFeePipe } from '@parts/pipes/is-visible-fee.pipe';
import { CustomAssetsComponent } from './tabs/custom-assets/pages/custom-assets/custom-assets.component';
import { CreateNewAssetComponent } from './tabs/custom-assets/pages/create-new-asset/create-new-asset.component';
import { ConfirmCreateCustomAssetComponent } from './tabs/custom-assets/modals/confirm-create-custom-asset/confirm-create-custom-asset.component';
import { UpdateCustomAssetComponent } from './tabs/custom-assets/modals/update-custom-asset/update-custom-asset.component';
import { EmitCustomAssetComponent } from './tabs/custom-assets/modals/emit-custom-asset/emit-custom-asset.component';
import { BurnCustomAssetComponent } from './tabs/custom-assets/modals/burn-custom-asset/burn-custom-asset.component';
import { TransactionDetailsForCustomAssetsComponent } from './tabs/custom-assets/modals/transaction-details-for-custom-assets/transaction-details-for-custom-assets.component';
import { TransactionDetailsComponent } from '@parts/components/transaction-details.component';
import { VisibilityBalanceDirective } from '@parts/directives/visibility-balance.directive';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoaderComponent } from '@parts/components/loader.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        WalletComponent,
        AssetsComponent,
        WalletDetailsComponent,
        HistoryComponent,
        StakingComponent,
        ReceiveComponent,
        ExportImportComponent,
        SendComponent,
        MigrateWalletToZarcanumComponent,
        SuccessSweepBareOutsComponent,
        CustomAssetsComponent,
        CreateNewAssetComponent,
        ConfirmCreateCustomAssetComponent,
        UpdateCustomAssetComponent,
        EmitCustomAssetComponent,
        BurnCustomAssetComponent,
        TransactionDetailsForCustomAssetsComponent,
    ],
    imports: [
        CommonModule,
        WalletRoutingModule,
        FlexModule,
        TooltipModule,
        ShortStringPipe,
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
        AssetDetailsComponent,
        CopyButtonComponent,
        LowerCaseDirective,
        BreadcrumbsComponent,
        BackButtonComponent,
        WalletModalsModule,
        GetAssetInfoPipe,
        GetAmountItemsPipe,
        TransactionStatusComponent,
        IsVisibleFeePipe,
        TransactionDetailsComponent,
        VisibilityBalanceDirective,
        MatAutocompleteModule,
        LoaderComponent,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
    ],
})
export class WalletModule {}
