import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendModalComponent } from './send-modal/send-modal.component';
import { SendDetailsModalComponent } from './send-details-modal/send-details-modal.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GetAssetInfoPipe } from '@parts/pipes';
import { CopyButtonComponent } from '@parts/components/copy-button.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [SendModalComponent, SendDetailsModalComponent],
    imports: [CommonModule, TranslateModule, FlexLayoutModule, ReactiveFormsModule, GetAssetInfoPipe, CopyButtonComponent, MatIconModule],
    exports: [SendModalComponent, SendDetailsModalComponent],
})
export class WalletModalsModule {}
