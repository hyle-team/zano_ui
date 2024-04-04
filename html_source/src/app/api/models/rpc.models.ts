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
