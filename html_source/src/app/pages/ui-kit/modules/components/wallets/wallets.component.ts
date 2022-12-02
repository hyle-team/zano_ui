import { Component } from '@angular/core';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent {
  classWalletActive = true;

  classWalletAuditable = false;

  classWalletWatchOnly = false;

  showIndicator = false;

  showPrice = true;

  percentRed = false;

  showStaking = true;

  showProgressBar = false;
}
