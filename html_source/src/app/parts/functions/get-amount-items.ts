import { Subtransfer, Transaction } from '@api/models/transaction.model';
import { Wallet } from '@api/models/wallet.model';
import { intToMoney } from '@parts/functions/int-to-money';
import { AssetInfo } from '@api/models/assets.model';
import { zanoAssetInfo } from '@parts/data/assets';
import { isFinalizator, isInitiator, isSelfTransaction, isSwapTransaction } from '@parts/functions/identify-transaction';

export interface AmountItem {
    amount: string;
    ticker: string;
}

export type AmountItems = AmountItem[];

export const getAmountItems = (transaction: Transaction, wallet: Wallet): AmountItems => {
    const { subtransfers, fee } = transaction;

    const items: { amount: string; ticker: string }[] = [];

    if (!subtransfers?.length) {
        items.push({ amount: '0', ticker: zanoAssetInfo.ticker });
        return items;
    }

    if (isInitiator(transaction) && !Boolean(subtransfers.find(({ asset_id }) => asset_id === zanoAssetInfo.asset_id))) {
        const preparedAmount: string = intToMoney(fee, zanoAssetInfo.decimal_point);
        items.push({ amount: preparedAmount, ticker: zanoAssetInfo.ticker });
    }

    subtransfers.forEach((subtransfer: Subtransfer) => {
        const { asset_id, amount, is_income } = subtransfer;
        const asset_info: AssetInfo | undefined = wallet.allAssetsInfo.find(v => asset_id === v.asset_id);

        if (!asset_info) {
            if (amount.toNumber() === 0) {
                return;
            }

            const preparedAmount: string = (is_income ? amount : amount.negated()).toString();
            items.push({ amount: preparedAmount, ticker: '***' });
            return;
        }

        const { ticker, decimal_point } = asset_info;

        if (asset_id !== zanoAssetInfo.asset_id) {
            if (amount.toNumber() === 0) {
                return;
            }

            const preparedAmount: string = intToMoney(is_income ? amount : amount.negated(), decimal_point);
            items.push({ amount: preparedAmount, ticker });
            return;
        }

        if (asset_id === zanoAssetInfo.asset_id) {
            const { address } = wallet;

            const selfTransaction: boolean = isSelfTransaction(transaction, address);
            const swapTransaction: boolean = isSwapTransaction(transaction);
            const finalizator: boolean = isFinalizator(transaction);
            const initiator: boolean = isInitiator(transaction);

            const condition_1: boolean = !amount.eq(fee ?? 0) || selfTransaction || (swapTransaction && finalizator);
            const condition_2: boolean = amount.toNumber() !== 0;

            if (!is_income ? condition_1 : condition_2) {
                let preparedAmount!: string;

                if (is_income) {
                    preparedAmount = intToMoney(initiator ? amount.plus(fee) : amount, decimal_point);
                } else {
                    preparedAmount = intToMoney((initiator ? amount.minus(fee ?? 0) : amount).negated(), decimal_point);
                }

                items.push({ amount: preparedAmount, ticker });
                return;
            }
        }
    });

    return items;
};
