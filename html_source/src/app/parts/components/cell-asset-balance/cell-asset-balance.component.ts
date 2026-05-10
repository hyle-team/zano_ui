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

    isEqualUnlockedAndTotal(): boolean {
        return BigNumber(this.balance.unlocked).eq(this.balance.total);
    }

    getTotalAmount(): string {
        return intToMoney(this.balance.total, this.balance.asset_info.decimal_point);
    }

    getUnlockedAmount(): string {
        return intToMoney(this.balance.unlocked, this.balance.asset_info.decimal_point);
    }

    getLockedAmount(): string {
        return intToMoney(BigNumber(this.balance.total).minus(this.balance.unlocked), this.balance.asset_info.decimal_point);
    }

    getTicker(): string {
        return this.balance.asset_info.ticker ?? '';
    }
}
