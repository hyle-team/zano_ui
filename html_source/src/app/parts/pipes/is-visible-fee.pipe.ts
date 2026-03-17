import { Pipe, PipeTransform } from '@angular/core';
import { hasOutgoingSubtransfer, isInitiator } from '@parts/functions/identify-transaction';
import { Transaction } from '@api/models/transaction.model';

@Pipe({
    name: 'isVisibleFee',
    standalone: true,
})
export class IsVisibleFeePipe implements PipeTransform {
    transform(transaction: Transaction): boolean {
        // The fee is visible only if the user is the sender AND there's at least one outgoing subtransfer.
        return isInitiator(transaction) && hasOutgoingSubtransfer(transaction);
    }
}
