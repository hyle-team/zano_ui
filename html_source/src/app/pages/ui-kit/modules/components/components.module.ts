import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsComponent, ProgressBarsComponent } from './';

@NgModule({
  declarations: [ButtonsComponent, ProgressBarsComponent],
  imports: [
    CommonModule
  ],
  exports: [ButtonsComponent, ProgressBarsComponent]
})
export class ComponentsModule { }
