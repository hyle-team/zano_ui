import { NgModule } from '@angular/core';
import { ExportHistoryModalComponent } from './export-history-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SwitchModule } from '../../../../../_helpers/components/switch/switch.module';
import { CheckboxModule } from '../../../../../_helpers/components/checkbox/checkbox.module';

@NgModule({
  declarations: [ExportHistoryModalComponent],
  exports: [ExportHistoryModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FlexModule,
    SwitchModule,
    CheckboxModule,
    NgSelectModule,
    FormsModule,
  ],
})
export class ExportHistoryModalModule {}
