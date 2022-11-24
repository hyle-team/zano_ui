import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailsComponent } from './transaction-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { TooltipModule } from '../tooltip/tooltip.module';

@NgModule({
  declarations: [TransactionDetailsComponent],
  exports: [TransactionDetailsComponent],
  imports: [CommonModule, TranslateModule, FlexModule, TooltipModule],
})
export class TransactionDetailsModule {}
