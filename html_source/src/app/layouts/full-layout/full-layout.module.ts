import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullLayoutComponent } from './full-layout.component';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
            declarations: [FullLayoutComponent],
            imports: [
              AppRoutingModule,
              CommonModule
            ],
            exports: [FullLayoutComponent]
          })
export class FullLayoutModule {
}
