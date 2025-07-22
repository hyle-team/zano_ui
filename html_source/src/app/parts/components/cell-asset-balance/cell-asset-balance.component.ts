import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetBalance } from '@api/models/assets.model';
import { IntToMoneyPipeModule } from '@parts/pipes';
import { VisibilityBalanceDirective } from '@parts/directives/visibility-balance.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { intToMoney } from '@parts/functions/int-to-money';
import { BigNumber } from 'bignumber.js';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'zano-cell-asset-balance',
    standalone: true,
    imports: [CommonModule, IntToMoneyPipeModule, VisibilityBalanceDirective, MatIconModule, MatTooltipModule, TranslateModule],
    templateUrl: './cell-asset-balance.component.html',
    styleUrls: ['./cell-asset-balance.component.scss'],
})
export class CellAssetBalanceComponent {
    @Input() balance: AssetBalance;

    isEqualUnlockedAndTotal() {
        return BigNumber(this.balance.unlocked).eq(this.balance.total);
    }

    getUnlockedAmount() {
        return intToMoney(this.balance.unlocked, this.balance.asset_info.decimal_point);
    }

    getLockedAmount() {
        return intToMoney(BigNumber(this.balance.total).minus(this.balance.unlocked));
    }

    getTicker() {
        return this.balance.asset_info.ticker ?? '';
    }
}
