import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendModalComponent } from './send-modal/send-modal.component';
import { SendDetailsModalComponent } from './send-details-modal/send-details-modal.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { GetWhiteAssetPipe } from '@parts/pipes';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SendModalComponent, SendDetailsModalComponent],
  imports: [CommonModule, TranslateModule, GetWhiteAssetPipe, FlexLayoutModule, ReactiveFormsModule],
  exports: [SendModalComponent, SendDetailsModalComponent],
})
export class WalletModalsModule {}
