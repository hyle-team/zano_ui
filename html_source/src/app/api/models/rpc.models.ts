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

export interface ResponseGetAssetInfo {
    id: number;
    jsonrpc: string;
    result: {
        asset_descriptor: {
            current_supply: number;
            decimal_point: number;
            full_name: string;
            hidden_supply: boolean;
            meta_info: string;
            owner: string;
            owner_eth_pub_key: string;
            ticker: string;
            total_max_supply: number;
        };
        status: string;
    };
}
