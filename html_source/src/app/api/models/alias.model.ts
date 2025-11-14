export interface AliasInfo {
    alias: string;
    address: string;
    comment: string;
    tracking_key?: string;
}

export type AliasInfoList = AliasInfo[];

export interface AliasLookupParams {
    alias_first_leters: string;
    n_of_items_to_return: number;
}

export interface AliasLookupResponse {
    id: number;
    jsonrpc: string;
    result: {
        aliases?: AliasInfoList;
        error_code: string;
        status: string;
    };
}

export type AliasLookupCallback = (status: boolean, response_data: AliasLookupResponse) => void;
