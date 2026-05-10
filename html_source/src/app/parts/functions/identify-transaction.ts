import { Transaction } from '@api/models/transaction.model';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';

export const isInitiator = (transaction: Transaction): boolean => {
    const spent = transaction.employed_entries?.spent;
    // The initiator is the one who has a spent entry with index 0.
    return spent?.some((entry) => entry.index === 0) ?? false;
};

export const isFinalizator = (transaction: Transaction): boolean => {
    return !isInitiator(transaction);
};

export const isSelfTransaction = (transaction: Transaction, address: string): boolean => {
    const {
        remote_addresses,
        employed_entries: { receive, spent },
        subtransfers_by_pid,
        fee,
    } = transaction;

    // Condition 1: Recipient address must be in remote addresses.
    if (!remote_addresses?.includes(address)) {
        return false;
    }

    // Condition 2: All main entries must be for the ZANO asset.
    const allEntriesAreZano =
        (spent?.every((e) => e.asset_id === ZANO_ASSET_INFO.asset_id) ?? true) &&
        (receive?.every((e) => e.asset_id === ZANO_ASSET_INFO.asset_id) ?? true);

    if (!allEntriesAreZano) {
        return false;
    }

    // Condition 3: Must have exactly one subtransfer, which is a ZANO fee transfer.
    if (!subtransfers_by_pid) {
        return false;
    }

    let firstSubtransfer = null;
    let count = 0;
    for (const group of subtransfers_by_pid) {
        count += group.subtransfers.length;
        if (count > 1) {
            // Optimization: if we find more than one, we can exit immediately.
            return false;
        }
        if (group.subtransfers.length === 1) {
            firstSubtransfer = group.subtransfers[0];
        }
    }

    if (count !== 1) {
        return false;
    }

    // Check if the single subtransfer matches the fee details.
    return firstSubtransfer.asset_id === ZANO_ASSET_INFO.asset_id && firstSubtransfer.amount.eq(fee);
};

export const isSwapTransaction = (transaction: Transaction): boolean => {
    const { subtransfers_by_pid } = transaction;

    if (!subtransfers_by_pid) {
        return false;
    }

    let hasIncome = false;
    let hasOutgoing = false;

    for (const group of subtransfers_by_pid) {
        for (const sub of group.subtransfers) {
            if (sub.is_income) {
                hasIncome = true;
            } else {
                hasOutgoing = true;
            }
            // If we've found both types, we can stop searching immediately.
            if (hasIncome && hasOutgoing) {
                return true;
            }
        }
    }

    return false; // Reached the end without finding both
};

export const hasOutgoingSubtransfer = (transaction: Transaction): boolean => {
    const { subtransfers_by_pid } = transaction;
    // Check if subtransfers exist and if any subtransfer in any group is an outgoing one.
    return !!subtransfers_by_pid && subtransfers_by_pid.some(({ subtransfers }) => subtransfers.some(({ is_income }) => !is_income));
};
