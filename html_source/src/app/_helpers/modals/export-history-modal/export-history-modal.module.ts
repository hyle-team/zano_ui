import { NgModule } from '@angular/core';
import { ExportHistoryModalComponent } from './export-history-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { SharedModule } from '../../../_shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ExportHistoryModalComponent],
  exports: [ExportHistoryModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FlexModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
  ],
})
export class ExportHistoryModalModule {}
