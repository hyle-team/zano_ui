import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsComponent, FormModule, ProgressBarsComponent } from './';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { TranslateModule } from '@ngx-translate/core';
import { WalletsComponent } from './wallets/wallets.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SwitchModule } from '../../../../_helpers/components/switch/switch.module';
import { CheckboxModule } from '../../../../_helpers/components/checkbox/checkbox.module';

@NgModule({
  declarations: [
    ButtonsComponent,
    ProgressBarsComponent,
    BreadcrumbsComponent,
    WalletsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormModule,
    FlexLayoutModule,
    SwitchModule,
    CheckboxModule,
    DragDropModule,
  ],
  exports: [
    ButtonsComponent,
    ProgressBarsComponent,
    BreadcrumbsComponent,
    WalletsComponent,
    FormModule,
  ],
})
export class ComponentsModule {}
