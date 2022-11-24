import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth.module';
import { UiKitModule } from './ui-kit/ui-kit.module';
import { WalletModule } from './wallet/wallet.module';
import { PagesRoutingModule } from './pages-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { AddWalletComponent } from './add-wallet/add-wallet.component';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { OpenWalletComponent } from './open-wallet/open-wallet.component';
import { OpenWalletModalComponent } from '@parts/modals/open-wallet-modal/open-wallet-modal.component';
import { RestoreWalletComponent } from './restore-wallet/restore-wallet.component';
import { SeedPhraseComponent } from './seed-phrase/seed-phrase.component';
import { AssignAliasComponent } from './assign-alias/assign-alias.component';
import { EditAliasComponent } from './edit-alias/edit-alias.component';
import { PurchaseComponent } from './wallet/tabs/contracts/purchase/purchase.component';
import { InputValidateDirective } from '@parts/directives/input-validate/input-validate.directive';
import { ModalContainerComponent } from '@parts/modals/modal-container/modal-container.component';
import { InputDisableSelectionDirective } from '@parts/directives/input-disable-selection/input-disable-selection.directive';
import { ContactsComponent } from './contacts/contacts.component';
import { AddContactsComponent } from './add-contacts/add-contacts.component';
import { ContactSendComponent } from './contact-send/contact-send.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DisablePriceFetchModule } from '../parts/directives/disable-price-fetch/disable-price-fetch.module';
import { TooltipModule } from '@parts/directives/tooltip/tooltip.module';
import { ConfirmModalModule } from '@parts/modals/confirm-modal/confirm-modal.module';
import { DeeplinkModule } from './deeplink/deeplink.module';
import { StakingSwitchModule } from '@parts/directives/staking-switch/staking-switch.module';
import { FullLayoutModule } from '../layouts/full-layout/full-layout.module';
import { WithSidebarLayoutModule } from '../layouts/with-sidebar-layout/with-sidebar-layout.module';
import { SynchronizationStatusModule } from '@parts/components/synchronization-status/synchronization-status.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { CopyButtonModule } from '../parts/components/copy-button/copy-button.module';
import { DefaultImgModule } from '../parts/directives/default-img';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SwitchModule } from '../parts/components/switch/switch.module';
import { CheckboxModule } from '../parts/components/checkbox/checkbox.module';
import { TransferAliasComponent } from './transfer-alias/transfer-alias.component';
import {
  ContractStatusMessagesPipeModule,
  ContractTimeLeftPipeModule,
  GetAssetInfoByIdPipeModule,
  HistoryTypeMessagesPipeModule,
  IntToMoneyPipeModule,
  IsAvailableAliasNamePipeModule,
  MoneyToIntPipeModule,
  SafeHtmlPipeModule,
  ShortStringPipeModule,
} from '@parts/pipes';

@NgModule({
  declarations: [
    LoginComponent,
    SettingsComponent,
    AddWalletComponent,
    CreateWalletComponent,
    OpenWalletComponent,
    OpenWalletModalComponent,
    RestoreWalletComponent,
    SeedPhraseComponent,
    AssignAliasComponent,
    EditAliasComponent,
    TransferAliasComponent,
    PurchaseComponent,
    InputValidateDirective,
    ModalContainerComponent,
    InputDisableSelectionDirective,
    ContactsComponent,
    AddContactsComponent,
    ContactSendComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    AuthModule,
    UiKitModule,
    WalletModule,

    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TranslateModule.forChild(),
    FlexLayoutModule,
    DisablePriceFetchModule,
    TooltipModule,
    ConfirmModalModule,
    DeeplinkModule,
    StakingSwitchModule,
    FullLayoutModule,
    WithSidebarLayoutModule,
    SynchronizationStatusModule,
    SwitchModule,
    CheckboxModule,
    OverlayModule,
    CopyButtonModule,
    DefaultImgModule,
    ContractStatusMessagesPipeModule,
    ContractTimeLeftPipeModule,
    GetAssetInfoByIdPipeModule,
    HistoryTypeMessagesPipeModule,
    IntToMoneyPipeModule,
    IsAvailableAliasNamePipeModule,
    MoneyToIntPipeModule,
    SafeHtmlPipeModule,
    ShortStringPipeModule,
  ],
})
export class PagesModule {}
