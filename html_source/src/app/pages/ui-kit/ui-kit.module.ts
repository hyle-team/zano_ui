import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiKitComponent } from './ui-kit.component';
import { UiKitRoutingModule } from './ui-kit-routing.module';
import { ComponentsModule, FormModule } from './modules';
@NgModule({
  declarations: [UiKitComponent],
  imports: [
    CommonModule,
    FormModule,
    ComponentsModule,
    UiKitRoutingModule
  ]
})
export class UiKitModule { }
