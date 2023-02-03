import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomTokenComponent } from './add-custom-token.component';
import { FlexModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '@parts/components/loader.component';

@NgModule({
  declarations: [AddCustomTokenComponent],
  exports: [AddCustomTokenComponent],
  imports: [
    CommonModule,
    FlexModule,
    TranslateModule,
    ReactiveFormsModule,
    LoaderComponent,
  ],
})
export class AddCustomTokenModule {}
