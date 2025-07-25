import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeeplinkModalComponent } from './deeplink-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { AutoFocusDirective } from '@parts/directives/autofocus.directive';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
    declarations: [DeeplinkModalComponent],
    imports: [CommonModule, NgSelectModule, FormsModule, FlexLayoutModule, TranslateModule, MatIconModule, AutoFocusDirective, A11yModule],
    exports: [DeeplinkModalComponent],
})
export class DeeplinkModalModule {}
