import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoWalletComponent } from './no-wallet.component';
import { NoWalletRoutingModule } from './no-wallet-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SynchronizationStatusModule } from '../../../synchronization-status/synchronization-status.module';

@NgModule({
            declarations: [NoWalletComponent],
            imports: [
              CommonModule,
              NoWalletRoutingModule,
              TranslateModule,
              SynchronizationStatusModule
            ]
          })
export class NoWalletModule {
}
