import { Transaction } from '@api/models/transaction.model';
import { ZANO_ASSET_INFO } from '@parts/data/assets';

export const isInitiator = (transaction: Transaction): boolean => {
    const {
        employed_entries: { spent = [] }
    } = transaction;
    return Boolean(
        spent?.find(({ index }) => {
            return index === 0;
        })
    );
};

export const isFinalizator = (transaction: Transaction): boolean => {
    return !isInitiator(transaction);
};

export const isSelfTransaction = (transaction: Transaction, address: string): boolean => {
    const {
        remote_addresses,
        employed_entries: { receive, spent },
        subtransfers,
        fee
    } = transaction;

    const condition1 = remote_addresses?.includes(address);
    const condition2 = [...(receive ?? []), ...(spent ?? [])].map(({ asset_id }) => asset_id === ZANO_ASSET_INFO.asset_id).every(Boolean);
    const condition3 =
        subtransfers?.length === 1 && subtransfers[0].asset_id === ZANO_ASSET_INFO.asset_id && subtransfers[0].amount.eq(fee);

    return condition1 && condition2 && condition3;
};

export const isSwapTransaction = (transaction: Transaction): boolean => {
    const { subtransfers } = transaction;
    const arr = subtransfers.map(({ is_income }) => is_income);
    const condition1 = arr.some(value => value);
    const condition2 = arr.some(value => !value);
    return condition1 && condition2;
};
