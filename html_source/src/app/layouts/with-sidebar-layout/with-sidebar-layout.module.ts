import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithSidebarLayoutComponent } from './with-sidebar-layout.component';
import { AppRoutingModule } from '../../app-routing.module';
import { SidebarModule } from '../../sidebar/sidebar.module';

@NgModule({
            declarations: [WithSidebarLayoutComponent],
            imports: [
              AppRoutingModule,
              CommonModule,
              SidebarModule
            ],
            exports: [WithSidebarLayoutComponent]
          })
export class WithSidebarLayoutModule {
}
