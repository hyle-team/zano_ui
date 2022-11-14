import { Component, Input } from '@angular/core';
import { Asset, AssetInfo } from '../../../_helpers/models/assets';

@Component({
  selector: 'app-asset-token-card',
  templateUrl: './asset-token-card.component.html',
  styleUrls: ['./asset-token-card.component.scss']
})
export class AssetTokenCardComponent {
  @Input() asset: Asset;

  @Input() assetInfo: AssetInfo | null | undefined;

  stateMenuDropdown = false;

  defaultImgSrc = 'assets/icons/currency-icons/custom_token.svg';

  toggleMenuDropdown(): void {
    this.stateMenuDropdown = !this.stateMenuDropdown;
  }
}
