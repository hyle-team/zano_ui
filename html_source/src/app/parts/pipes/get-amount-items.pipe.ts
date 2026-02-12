import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '@api/models/transaction.model';
import { Wallet } from '@api/models/wallet.model';
import { AmountItems, getAmountItems } from '@parts/functions/get-amount-items';

@Pipe({
    name: 'getAmountItems',
    standalone: true,
    pure: false,
})
export class GetAmountItemsPipe implements PipeTransform {
    transform(transaction: Transaction, wallet: Wallet): AmountItems {
        return getAmountItems(transaction, wallet);
    }
}
