import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeeplinkModalComponent } from './deeplink-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DeeplinkModalComponent],
            imports: [
              CommonModule,
              NgSelectModule,
              FormsModule,
              TranslateModule
            ],
  exports: [DeeplinkModalComponent],
  entryComponents: [DeeplinkModalComponent]
})
export class DeeplinkModalModule { }
