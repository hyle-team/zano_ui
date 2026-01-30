import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendModalComponent } from './send-modal/send-modal.component';
import { SendDetailsModalComponent } from './send-details-modal/send-details-modal.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GetAssetInfoPipe, IntToMoneyPipeModule } from '@parts/pipes';
import { CopyButtonComponent } from '@parts/components/copy-button.component';
import { MatIconModule } from '@angular/material/icon';
import { AutoFocusDirective } from '@parts/directives/autofocus.directive';
import { CustomNumberFormatPipe } from '@parts/pipes/custom-number.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { GetLogoByAssetInfoPipe } from '@parts/pipes/get-logo-by-asset-info.pipe';
import { TooltipDirective } from '@parts/directives';

@NgModule({
    declarations: [SendModalComponent, SendDetailsModalComponent],
    imports: [
        CommonModule,
        TranslateModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        GetAssetInfoPipe,
        CopyButtonComponent,
        MatIconModule,
        AutoFocusDirective,
        CustomNumberFormatPipe,
        MatDividerModule,
        GetLogoByAssetInfoPipe,
        IntToMoneyPipeModule,
        TooltipDirective,
    ],
    exports: [SendModalComponent, SendDetailsModalComponent],
})
export class WalletModalsModule {}
