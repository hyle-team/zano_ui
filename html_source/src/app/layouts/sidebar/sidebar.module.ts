import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TooltipModule } from '../../parts/directives/tooltip/tooltip.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SynchronizationStatusModule } from '../../parts/components/synchronization-status/synchronization-status.module';
import { DisablePriceFetchModule } from '../../parts/directives/disable-price-fetch/disable-price-fetch.module';
import { ConfirmModalModule } from '../../parts/modals/confirm-modal/confirm-modal.module';
import { DeeplinkModule } from '../../pages/deeplink/deeplink.module';
import { StakingSwitchModule } from '../../parts/components/staking-switch/staking-switch.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IntToMoneyPipeModule } from '@parts/pipes';

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
  ],
  exports: [SidebarComponent],
})
export class SidebarModule {}
