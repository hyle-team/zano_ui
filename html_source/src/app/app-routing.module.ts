import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddWalletComponent } from './pages/add-wallet/add-wallet.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CreateWalletComponent } from './pages/create-wallet/create-wallet.component';
import { OpenWalletComponent } from './pages/open-wallet/open-wallet.component';
import { RestoreWalletComponent } from './pages/restore-wallet/restore-wallet.component';
import { SeedPhraseComponent } from './pages/seed-phrase/seed-phrase.component';
import { AssignAliasComponent } from './pages/assign-alias/assign-alias.component';
import { EditAliasComponent } from './pages/edit-alias/edit-alias.component';
import { TransferAliasComponent } from './_helpers/components/transfer-alias/transfer-alias.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { AddContactsComponent } from './pages/add-contacts/add-contacts.component';
import { ContactSendComponent } from './pages/contact-send/contact-send.component';
import { ExportImportComponent } from './_helpers/components/export-import/export-import.component';
import { DeeplinkComponent } from './pages/deeplink/deeplink.component';
import { paths } from './paths';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { WithSidebarLayoutComponent } from './layouts/with-sidebar-layout/with-sidebar-layout.component';
import { WalletDetailsComponent } from './pages/wallet-details/wallet-details.component';

const routes: Routes = [
  {
    path: paths.addWallet,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: AddWalletComponent,
      },
    ],
  },
  {
    path: paths.details,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: WalletDetailsComponent,
      },
    ],
  },
  {
    path: paths.login,
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
    ],
  },
  {
    path: paths.create,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: CreateWalletComponent,
      },
    ],
  },
  {
    path: paths.open,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: OpenWalletComponent,
      },
    ],
  },
  {
    path: paths.restore,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: RestoreWalletComponent,
      },
    ],
  },
  {
    path: paths.seedPhrase,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: SeedPhraseComponent,
      },
    ],
  },
  {
    path: paths.assignAlias,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: AssignAliasComponent,
      },
    ],
  },
  {
    path: paths.editAlias,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: EditAliasComponent,
      },
    ],
  },
  {
    path: paths.transferAlias,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: TransferAliasComponent,
      },
    ],
  },
  {
    path: paths.settings,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: SettingsComponent,
      },
    ],
  },
  {
    path: paths.contacts,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: ContactsComponent,
      },
    ],
  },
  {
    path: paths.addContacts,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: AddContactsComponent,
      },
    ],
  },
  {
    path: `${paths.editContacts}/:id`,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: AddContactsComponent,
      },
    ],
  },
  {
    path: `${paths.contactSend}/:id`,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: ContactSendComponent,
      },
    ],
  },
  {
    path: paths.import,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: ExportImportComponent,
      },
    ],
  },
  {
    path: paths.deeplink,
    component: WithSidebarLayoutComponent,
    children: [
      {
        path: '',
        component: DeeplinkComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: paths.addWallet,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
