import { Pipe, PipeTransform } from '@angular/core';
import { isInitiator } from '@parts/functions/identify-transaction';
import { Transaction } from '@api/models/transaction.model';

@Pipe({
    name: 'isVisibleFee',
    standalone: true
})
export class IsVisibleFeePipe implements PipeTransform {
    transform(transaction: Transaction): boolean {
        const { subtransfers } = transaction;
        const condition1 = subtransfers ? !subtransfers?.every(({ is_income }) => is_income) : false;
        const condition2 = isInitiator(transaction);
        return condition1 && condition2;
    }
}
