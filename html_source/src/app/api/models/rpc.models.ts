import { AliasInfo } from '@api/models/alias.model';

export interface GetBareOutsStats {
    expected_total_fee: number;
    total_amount: number;
    total_bare_outs: number;
    txs_count: number;
}

export interface SweepBareOuts {
    amount_swept: number;
    bare_outs_swept: number;
    fee_spent: number;
    txs_sent: number;
}

export interface ResultAliasByAddress {
    alias_info_list: AliasInfo[];
    status: string;
}
