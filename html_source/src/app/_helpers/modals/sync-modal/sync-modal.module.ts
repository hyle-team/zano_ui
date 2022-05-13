import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncModalComponent } from './sync-modal.component';

@NgModule({
  declarations: [SyncModalComponent],
  imports: [
    CommonModule
  ],
  exports: [SyncModalComponent],
  entryComponents: [SyncModalComponent]
})
export class SyncModalModule { }
