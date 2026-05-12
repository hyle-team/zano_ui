import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoWalletComponent } from './no-wallet/no-wallet.component';
import { FullLayoutComponent } from '../../layouts/full-layout/full-layout.component';

const routes: Routes = [
    {
        path: 'auth',
        component: FullLayoutComponent,
        children: [
            {
                path: 'no-wallet',
                component: NoWalletComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
