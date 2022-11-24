import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SynchronizationStatusModule } from '../../parts/components/synchronization-status/synchronization-status.module';
import { NoWalletComponent } from './no-wallet/no-wallet.component';

@NgModule({
  declarations: [NoWalletComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    TranslateModule,
    FlexLayoutModule,
    SynchronizationStatusModule,
  ],
})
export class AuthModule {}
