import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { CheckboxsComponent, InputsComponent, SelectsComponent, SwitchesComponent } from './components';

@NgModule({
  declarations: [FormComponent, InputsComponent, SelectsComponent, CheckboxsComponent, SwitchesComponent],
  imports: [
    CommonModule
  ],
  exports: [FormComponent, InputsComponent, SelectsComponent, CheckboxsComponent, SwitchesComponent]
})
export class FormModule {
}
