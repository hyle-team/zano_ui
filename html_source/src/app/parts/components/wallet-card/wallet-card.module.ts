import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletCardComponent } from './wallet-card.component';
import { DisablePriceFetchModule, TooltipModule } from '@parts/directives';
import { TranslateModule } from '@ngx-translate/core';
import { IntToMoneyPipeModule } from '@parts/pipes';
import { StakingSwitchModule } from '@parts/components/staking-switch';

@NgModule({
  declarations: [WalletCardComponent],
  exports: [WalletCardComponent],
  imports: [
    CommonModule,
    TooltipModule,
    TranslateModule,
    IntToMoneyPipeModule,
    StakingSwitchModule,
    DisablePriceFetchModule,
  ],
})
export class WalletCardModule {}
