import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeeplinkModalModule } from './dialogs/deeplink-modal/deeplink-modal.module';
import { SyncModalModule } from '@zano-helpers/modals/sync-modal/sync-modal.module';
import { DeeplinkComponent } from './deeplink.component';

@NgModule({
  declarations: [DeeplinkComponent],
  imports: [CommonModule, DeeplinkModalModule, SyncModalModule],
  exports: [DeeplinkComponent, DeeplinkModalModule, SyncModalModule],
})
export class DeeplinkModule {}
