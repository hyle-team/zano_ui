import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddWalletComponent } from './add-wallet/add-wallet.component';
import { LoginComponent } from './login/login.component';
import { WalletComponent } from './wallet/wallet.component';
import { SendComponent } from './send/send.component';
import { ReceiveComponent } from './receive/receive.component';
import { HistoryComponent } from './history/history.component';
import { ContractsComponent } from './contracts/contracts.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { StakingComponent } from './staking/staking.component';
import { SettingsComponent } from './settings/settings.component';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { OpenWalletComponent } from './open-wallet/open-wallet.component';
import { RestoreWalletComponent } from './restore-wallet/restore-wallet.component';
import { SeedPhraseComponent } from './seed-phrase/seed-phrase.component';
import { WalletDetailsComponent } from './wallet-details/wallet-details.component';
import { AssignAliasComponent } from './assign-alias/assign-alias.component';
import { EditAliasComponent } from './edit-alias/edit-alias.component';
import { TransferAliasComponent } from './transfer-alias/transfer-alias.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AddContactsComponent } from './add-contacts/add-contacts.component';
import { ContactSendComponent } from './contact-send/contact-send.component';
import { ExportImportComponent } from './export-import/export-import.component';
import { DeeplinkComponent } from './deeplink/deeplink.component';
import { ContractsTabComponent } from './contracts/contracts-tab/contracts-tab.component';
import { paths, pathChildrenContracts, pathChildrenWallet } from './paths';

const routes: Routes = [
  {
    path: paths.addWallet,
    component: AddWalletComponent
  },
  {
    path: paths.login,
    component: LoginComponent
  },
  {
    path: paths.wallet,
    component: WalletComponent,
    children: [
      {
        path: pathChildrenWallet.send,
        component: SendComponent
      },
      {
        path: pathChildrenWallet.receive,
        component: ReceiveComponent
      },
      {
        path: pathChildrenWallet.history,
        component: HistoryComponent
      },
      {
        path: pathChildrenWallet.contracts,
        component: ContractsTabComponent,
        children: [
          {
            path: '',
            component: ContractsComponent,
          },
          {
            path: pathChildrenContracts.purchase,
            component: PurchaseComponent
          },
          {
            path: `${ pathChildrenContracts.purchase }/:id`,
            component: PurchaseComponent
          },
          {
            path: '**', redirectTo: '',
          },
        ]
      },

      {
        path: pathChildrenWallet.staking,
        component: StakingComponent
      },
      {
        path: '',
        redirectTo: pathChildrenWallet.history,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: paths.create,
    component: CreateWalletComponent
  },
  {
    path: paths.open,
    component: OpenWalletComponent
  },
  {
    path: paths.restore,
    component: RestoreWalletComponent
  },
  {
    path: paths.seedPhrase,
    component: SeedPhraseComponent
  },
  {
    path: paths.details,
    component: WalletDetailsComponent
  },
  {
    path: paths.assignAlias,
    component: AssignAliasComponent
  },
  {
    path: paths.editAlias,
    component: EditAliasComponent
  },
  {
    path: paths.transferAlias,
    component: TransferAliasComponent
  },
  {
    path: paths.settings,
    component: SettingsComponent
  },
  {
    path: paths.contacts,
    component: ContactsComponent
  },
  {
    path: paths.addContacts,
    component: AddContactsComponent
  },
  {
    path: `${ paths.editContacts }/:id`,
    component: AddContactsComponent
  },
  {
    path: `${ paths.contactSend }/:id`,
    component: ContactSendComponent
  },
  {
    path: paths.import,
    component: ExportImportComponent
  },
  {
    path: paths.deeplink,
    component: DeeplinkComponent
  },
  {
    path: paths.uiKit,
    loadChildren: './pages/ui-kit/ui-kit.module#UiKitModule'
  },
  {
    path: '',
    redirectTo: paths.addWallet,
    pathMatch: 'full'
  }
];

@NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule]
          })


export class AppRoutingModule {
}
