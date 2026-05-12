import { RouterModule, Routes } from '@angular/router';
import { WithSidebarLayoutComponent } from '../layouts/with-sidebar-layout/with-sidebar-layout.component';
import { AddWalletComponent } from './add-wallet/add-wallet.component';
import { WalletDetailsComponent } from './wallet-details/wallet-details.component';
import { FullLayoutComponent } from '../layouts/full-layout/full-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { OpenWalletComponent } from './open-wallet/open-wallet.component';
import { RestoreWalletComponent } from './restore-wallet/restore-wallet.component';
import { SeedPhraseComponent } from './seed-phrase/seed-phrase.component';
import { AssignAliasComponent } from './assign-alias/assign-alias.component';
import { EditAliasComponent } from './edit-alias/edit-alias.component';
import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { ExportImportComponent } from './export-import/export-import.component';
import { TransferAliasComponent } from './transfer-alias/transfer-alias.component';
import { LoginRedirectGuard } from './auth/guards/login-redirect.guard';

const routes: Routes = [
    {
        path: 'add-wallet',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: AddWalletComponent,
            },
        ],
    },
    {
        path: 'details',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: WalletDetailsComponent,
            },
        ],
    },
    {
        path: 'login',
        component: FullLayoutComponent,
        canActivate: [LoginRedirectGuard],
        children: [
            {
                path: '',
                component: LoginComponent,
            },
        ],
    },
    {
        path: 'create',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: CreateWalletComponent,
            },
        ],
    },
    {
        path: 'open',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: OpenWalletComponent,
            },
        ],
    },
    {
        path: 'restore',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: RestoreWalletComponent,
            },
        ],
    },
    {
        path: 'seed-phrase',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: SeedPhraseComponent,
            },
        ],
    },
    {
        path: 'assign-alias',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: AssignAliasComponent,
            },
        ],
    },
    {
        path: 'edit-alias',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: EditAliasComponent,
            },
        ],
    },
    {
        path: 'transfer-alias',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: TransferAliasComponent,
            },
        ],
    },
    {
        path: 'settings',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: SettingsComponent,
            },
        ],
    },
    {
        path: 'import',
        component: WithSidebarLayoutComponent,
        children: [
            {
                path: '',
                component: ExportImportComponent,
            },
        ],
    },
    {
        path: '',
        redirectTo: 'add-wallet',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
