import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AddWalletComponent } from './pages/add-wallet/add-wallet.component';
import { CreateWalletComponent } from './pages/create-wallet/create-wallet.component';
import { OpenWalletComponent } from './pages/open-wallet/open-wallet.component';
import { OpenWalletModalComponent } from './_helpers/dialogs/open-wallet-modal/open-wallet-modal.component';
import { RestoreWalletComponent } from './pages/restore-wallet/restore-wallet.component';
import { SeedPhraseComponent } from './pages/seed-phrase/seed-phrase.component';
import { AssignAliasComponent } from './pages/assign-alias/assign-alias.component';
import { EditAliasComponent } from './pages/edit-alias/edit-alias.component';
import { TransferAliasComponent } from './_helpers/components/transfer-alias/transfer-alias.component';
import { SendComponent } from './pages/wallet/tabs/send/send.component';
import { PurchaseComponent } from './pages/wallet/tabs/contracts/purchase/purchase.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BackendService } from './_helpers/services/backend.service';
import { ModalService } from './_helpers/services/modal.service';
import { PaginationStore } from './_helpers/services/pagination.store';
import { Store } from 'store';
import { InputValidateDirective } from './_helpers/directives/input-validate/input-validate.directive';
import { ModalContainerComponent } from './_helpers/modals/modal-container/modal-container.component';
import {
  ContextMenuModule,
  ContextMenuService,
} from '@perfectmemory/ngx-contextmenu';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting.src';
import { InputDisableSelectionDirective } from './_helpers/directives/input-disable-selection/input-disable-selection.directive';
import { SendModalComponent } from './pages/wallet/tabs/send/dialogs/send-modal/send-modal.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { AddContactsComponent } from './pages/add-contacts/add-contacts.component';
import { ContactSendComponent } from './pages/contact-send/contact-send.component';
import { ExportImportComponent } from './_helpers/components/export-import/export-import.component';
import { SendDetailsModalComponent } from './pages/wallet/tabs/send/dialogs/send-details-modal/send-details-modal.component';
import { DisablePriceFetchModule } from './_shared/directives/disable-price-fetch/disable-price-fetch.module';
import { SharedModule } from './_shared/shared.module';
import { SynchronizationStatusModule } from './_helpers/components/synchronization-status/synchronization-status.module';
import { TooltipModule } from './_helpers/directives/tooltip/tooltip.module';
import { WithSidebarLayoutModule } from './layouts/with-sidebar-layout/with-sidebar-layout.module';
import { FullLayoutModule } from './layouts/full-layout/full-layout.module';
import { PipesModule } from './_helpers/pipes/pipes.module';
import { ConfirmModalModule } from './_helpers/modals/confirm-modal/confirm-modal.module';
import { DeeplinkModule } from './pages/deeplink/deeplink.module';
import { StakingSwitchModule } from './_helpers/directives/staking-switch/staking-switch.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollXModule } from './_shared/components/scroll-x/scroll-x.module';
import { AssetTokenCardModule } from './_shared/components/asset-token-card/asset-token-card.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { AddCustomTokenModule } from './_helpers/modals/add-custom-token/add-custom-token.module';
import { ShortStringPipeModule } from './_shared/pipes/short-string-pipe/short-string-pipe.module';
import { IsAvailableAliasNamePipeModule } from './_shared/pipes/is-available-alias-name-pipe/is-available-alias-name-pipe.module';
import { CopyButtonModule } from './_shared/components/copy-button/copy-button.module';
import { GetAssetInfoByIdModule } from './_shared/pipes/get-asset-info-by-id/get-asset-info-by-id.module';
import { PagesModule } from './pages/pages.module';
import { DefaultImgModule } from './_shared/directives/default-img';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export function highchartsFactory(): any[] {
  highcharts.setOptions({
    time: {
      useUTC: false,
    },
  });

  return [exporting];
}

@NgModule({
  declarations: [
    AppComponent,
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
    SendComponent,
    PurchaseComponent,
    InputValidateDirective,
    ModalContainerComponent,
    InputDisableSelectionDirective,
    SendModalComponent,
    ContactsComponent,
    AddContactsComponent,
    ContactSendComponent,
    ExportImportComponent,
    SendDetailsModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ChartModule,
    FlexLayoutModule,
    DisablePriceFetchModule,
    TooltipModule,
    ConfirmModalModule,
    PipesModule,
    DeeplinkModule,
    StakingSwitchModule,
    FullLayoutModule,
    WithSidebarLayoutModule,
    SynchronizationStatusModule,
    SharedModule,
    ContextMenuModule,
    ScrollXModule,
    AssetTokenCardModule,
    OverlayModule,
    AddCustomTokenModule,
    ShortStringPipeModule,
    IsAvailableAliasNamePipeModule,
    CopyButtonModule,
    GetAssetInfoByIdModule,
    PagesModule,
    DefaultImgModule,
  ],
  providers: [
    Store,
    BackendService,
    ModalService,
    PaginationStore,
    ContextMenuService,
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsFactory },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
