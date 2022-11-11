import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { pathsChildrenAuth } from '../../paths';

const routes: Routes = [
  {
    path: pathsChildrenAuth.noWallet,
    loadChildren: () => import('./no-wallet/no-wallet.module').then(m => m.NoWalletModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
