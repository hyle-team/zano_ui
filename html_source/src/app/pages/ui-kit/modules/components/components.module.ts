import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsComponent, FormModule, ProgressBarsComponent } from './';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { TranslateModule } from '@ngx-translate/core';
import { WalletsComponent } from './wallets/wallets.component';
import { SharedModule } from '../../../../_shared/shared.module';

@NgModule({
  declarations: [ButtonsComponent, ProgressBarsComponent, BreadcrumbsComponent, WalletsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormModule,
    SharedModule
  ],
  exports: [ButtonsComponent, ProgressBarsComponent, BreadcrumbsComponent, WalletsComponent, FormModule]
})
export class ComponentsModule { }
