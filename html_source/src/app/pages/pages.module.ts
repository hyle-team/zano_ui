import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth.module';
import { UiKitModule } from './ui-kit/ui-kit.module';
import { WalletModule } from './wallet/wallet.module';

@NgModule({
  imports: [CommonModule, AuthModule, UiKitModule, WalletModule],
})
export class PagesModule {}
