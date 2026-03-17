export interface Subtransfer {
    amount: BigNumber;
    asset_id: string;
    is_income: boolean;
}

export type Subtransfers = Subtransfer[];

export interface SubtransferByPID {
    payment_id: string;
    subtransfers: Subtransfers;
}

export type SubtransfersByPID = SubtransferByPID[];

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
    remote_addresses: string[];
    subtransfers_by_pid?: SubtransfersByPID;
    show_sender: boolean;
    timestamp: number;
    tx_blob_size: number;
    remote_aliases?: string[];
    tx_hash: string;
    tx_type: number;
    unlock_time: number;
}

export type Transactions = Transaction[];
