import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SynchronizationStatusModule } from '@parts/components/synchronization-status/synchronization-status.module';
import { DisablePriceFetchModule, TooltipModule } from '@parts/directives';
import { ConfirmModalModule } from '@parts/modals/confirm-modal/confirm-modal.module';
import { DeeplinkModule } from '../../pages/deeplink/deeplink.module';
import { StakingSwitchModule } from '@parts/components/staking-switch';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IntToMoneyPipeModule } from '@parts/pipes';
import { WalletCardModule } from '@parts/components/wallet-card/wallet-card.module';

@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    TooltipModule,
    TranslateModule,
    DisablePriceFetchModule,
    ConfirmModalModule,
    SynchronizationStatusModule,
    DeeplinkModule,
    StakingSwitchModule,
    FlexLayoutModule,
    IntToMoneyPipeModule,
    WalletCardModule,
  ],
  exports: [SidebarComponent],
})
export class SidebarModule {}
