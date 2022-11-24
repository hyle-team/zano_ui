import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import {
  CheckboxsComponent,
  InputsComponent,
  SelectsComponent,
  SwitchesComponent,
} from './components';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from '../../../../../_helpers/components/checkbox/checkbox.module';
import { SwitchModule } from '../../../../../_helpers/components/switch/switch.module';

@NgModule({
  declarations: [
    FormComponent,
    InputsComponent,
    SelectsComponent,
    CheckboxsComponent,
    SwitchesComponent,
  ],
  imports: [
    CommonModule,
    SwitchModule,
    CheckboxModule,
    NgSelectModule,
    TranslateModule,
  ],
  exports: [
    FormComponent,
    InputsComponent,
    SelectsComponent,
    CheckboxsComponent,
    SwitchesComponent,
  ],
})
export class FormModule {}
