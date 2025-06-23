import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subtransfer, Subtransfers, Transaction } from '@api/models/transaction.model';
import { ZANO_ASSET_INFO } from '@parts/data/assets';
import { isFinalizator, isInitiator, isSwapTransaction } from '@parts/functions/identify-transaction';
import { VariablesService } from '@parts/services/variables.service';
import { TooltipModule } from '@parts/directives';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';

@Component({
    selector: 'app-transaction-status',
    standalone: true,
    imports: [CommonModule, TooltipModule, TranslateModule, FlexModule],
    templateUrl: './transaction-status.component.html',
    styleUrls: ['./transaction-status.component.scss'],
})
export class TransactionStatusComponent {
    @Input() transaction: Transaction;

    constructor(public variablesService: VariablesService) {}

    isVisibleStatusBySubtransfer(subtransfer: Subtransfer, transaction: Transaction): boolean {
        const { amount, asset_id, is_income } = subtransfer;
        const { fee, subtransfers } = transaction;

        if (subtransfers.length === 1 && asset_id === ZANO_ASSET_INFO.asset_id && is_income === false && amount.eq(fee)) {
            return true;
        }

        if (asset_id === ZANO_ASSET_INFO.asset_id && isSwapTransaction(transaction) && isFinalizator(transaction)) {
            return true;
        }

        return !(asset_id === ZANO_ASSET_INFO.asset_id && is_income === false && amount.eq(fee));
    }

    isIncome(subtransfer: Subtransfer, transaction: Transaction): boolean {
        const { amount, asset_id, is_income } = subtransfer;
        const { fee } = transaction;

        if (isInitiator(transaction)) {
            // Case: When the amount is less than the fee
            const condition1 = asset_id === ZANO_ASSET_INFO.asset_id;
            const condition2 = amount.isLessThan(fee);
            const condition3 = !is_income;
            if (condition1 && condition2 && condition3) {
                return true;
            }
            // ---------------------------------------------
        }

        return is_income;
    }

    getHeight(item): number {
        const { height_app } = this.variablesService;
        if ((height_app - item.height >= 10 && item.height !== 0) || (item.is_mining === true && item.height === 0)) {
            return 10;
        } else {
            if (item.height === 0 || height_app - item.height < 0) {
                return 0;
            } else {
                return height_app - item.height;
            }
        }
    }

    strokeSize(item): number {
        const rem = this.variablesService.settings.scale;
        if ((this.variablesService.height_app - item.height >= 10 && item.height !== 0) || (item.is_mining === true && item.height === 0)) {
            return 0;
        } else {
            if (item.height === 0 || this.variablesService.height_app - item.height < 0) {
                return 4.5 * parseInt(rem, 10);
            } else {
                return (
                    4.5 * parseInt(rem, 10) - ((4.5 * parseInt(rem, 10)) / 100) * ((this.variablesService.height_app - item.height) * 10)
                );
            }
        }
    }

    isLocked(item: Transaction): boolean {
        if (item.unlock_time > 500000000 && item.unlock_time > new Date().getTime() / 1000) {
            return true;
        }
        return item.unlock_time < 500000000 && item.unlock_time > this.variablesService.height_max;
    }

    time(item: Transaction): number {
        const now = new Date().getTime();
        return now + (item.unlock_time - this.variablesService.height_max) * 60 * 1000;
    }

    hasZano(subtransfers: Subtransfers): boolean {
        return Boolean(subtransfers.find(({ asset_id }) => asset_id === ZANO_ASSET_INFO.asset_id));
    }

    isInitiator(transaction: Transaction): boolean {
        return isInitiator(transaction);
    }
}
