import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConfirmModalComponent],
            imports: [
              CommonModule,
              TranslateModule
            ],
  exports: [ConfirmModalComponent],
  entryComponents: [ConfirmModalComponent]
})
export class ConfirmModalModule { }
