import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule, SwitchModule } from './components';

@NgModule({
  imports: [CommonModule, SwitchModule, CheckboxModule],
  exports: [SwitchModule, CheckboxModule],
})
export class SharedModule {}
