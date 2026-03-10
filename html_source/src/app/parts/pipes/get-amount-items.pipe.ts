import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '@api/models/transaction.model';
import { Wallet } from '@api/models/wallet.model';
import { getAmountItems } from '@parts/functions/get-amount-items';
import { AmountItems } from '@parts/interfaces/amount-items.interface';

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
