import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AutoFocusDirective } from '@parts/directives/autofocus.directive';
import { ConfirmModalComponent } from '@parts/modals/confirm-modal/confirm-modal.component';

@NgModule({
    declarations: [ConfirmModalComponent],
    imports: [CommonModule, TranslateModule, FlexLayoutModule, MatIconModule, MatDialogModule, AutoFocusDirective],
    exports: [ConfirmModalComponent],
})
export class ConfirmModalModule {}
