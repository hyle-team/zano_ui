import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncModalComponent } from './sync-modal.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
    declarations: [SyncModalComponent],
    imports: [CommonModule, FlexLayoutModule, TranslateModule, A11yModule],
    exports: [SyncModalComponent],
})
export class SyncModalModule {}
