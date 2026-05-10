import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletComponent } from './wallet/wallet.component';
import { SendComponent } from './tabs/send/send.component';
import { ReceiveComponent } from './tabs/receive/receive.component';
import { HistoryComponent } from './tabs/history/history.component';
import { StakingComponent } from './tabs/staking/staking.component';
import { AssetsComponent } from './tabs/assets/assets.component';
import { WithSidebarLayoutComponent } from '../../layouts/with-sidebar-layout/with-sidebar-layout.component';
import { ConfirmSwapComponent } from './tabs/swap/pages/confirm-swap/confirm-swap.component';
import { SwapComponent } from './tabs/swap/pages/swap/swap.component';
import { CreateSwapComponent } from './tabs/swap/pages/create-swap/create-swap.component';
import { SwapProposalHexComponent } from './tabs/swap/pages/swap-proposal-hex/swap-proposal-hex.component';
import { SwapProposalHexGuard } from './tabs/swap/parts/guards/swap-proposal-hex.guard';
import { CustomAssetsComponent } from './tabs/custom-assets/pages/custom-assets/custom-assets.component';
import { CreateNewAssetComponent } from './tabs/custom-assets/pages/create-new-asset/create-new-asset.component';
import { WalletAccessGuard } from './guards/wallet-access.guard';

const routes: Routes = [
    {
        path: 'wallet',
        component: WithSidebarLayoutComponent,
        canActivate: [WalletAccessGuard],
        canActivateChild: [WalletAccessGuard],
        children: [
            {
                path: '',
                component: WalletComponent,
                children: [
                    {
                        path: 'assets',
                        component: AssetsComponent,
                    },
                    {
                        path: 'send',
                        component: SendComponent,
                    },
                    {
                        path: 'receive',
                        component: ReceiveComponent,
                    },
                    {
                        path: 'history',
                        component: HistoryComponent,
                    },
                    {
                        path: 'staking',
                        component: StakingComponent,
                    },
                    {
                        path: 'swap',
                        component: SwapComponent,
                    },
                    {
                        path: 'create-swap',
                        component: CreateSwapComponent,
                    },
                    {
                        path: 'swap-proposal-hex',
                        component: SwapProposalHexComponent,
                        canDeactivate: [SwapProposalHexGuard],
                    },
                    {
                        path: 'confirm-swap',
                        component: ConfirmSwapComponent,
                    },
                    {
                        path: 'custom-assets',
                        component: CustomAssetsComponent,
                    },
                    {
                        path: 'create-new-asset',
                        component: CreateNewAssetComponent,
                    },
                    {
                        path: '',
                        redirectTo: 'assets',
                        pathMatch: 'full',
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WalletRoutingModule {}
