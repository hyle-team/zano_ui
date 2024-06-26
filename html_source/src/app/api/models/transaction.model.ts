import { BigNumber } from 'bignumber.js';

export interface Subtransfer {
    amount: BigNumber;
    asset_id: string;
    is_income: boolean;
}

export type Subtransfers = Subtransfer[];

export interface Transaction {
    comment: string;
    employed_entries: {
        receive: {
            amount: BigNumber;
            asset_id: string;
            index: number;
        }[];
        spent: {
            amount: BigNumber;
            asset_id: string;
            index: number;
        }[];
    };
    fee: BigNumber;
    height: number;
    is_mining: boolean;
    is_mixing: boolean;
    is_service: boolean;
    payment_id: string;
    remote_addresses: string[];
    show_sender: boolean;
    subtransfers?: Subtransfers | undefined;
    timestamp: number;
    tx_blob_size: number;
    remote_aliases?: string[];
    tx_hash: string;
    tx_type: number;
    unlock_time: number;
}

export type Transactions = Transaction[];
