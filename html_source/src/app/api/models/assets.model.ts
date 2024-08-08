export interface PriceInfo {
    success: boolean;
    data:
        | string
        | {
        name: string;
        usd: number;
        usd_24h_change: number;
    };
}

export interface AssetBalance {
    asset_info: AssetInfo;
    awaiting_in: number;
    awaiting_out: number;
    total: number;
    unlocked: number;
}

export interface AssetInfo {
    asset_id: string;
    current_supply: number;
    decimal_point: number;
    full_name: string;
    meta_info: string;
    owner: string;
    ticker: string;
    total_max_supply: number;
}

export type AssetBalances = AssetBalance[];

export interface ParamsCustomAssetId {
    wallet_id: number;
    asset_id: string;
}

export type ParamsAddCustomAssetId = ParamsCustomAssetId;

export interface ResponseAddCustomAssetId {
    status: string;
    asset_descriptor: {
        current_supply: number;
        decimal_point: number;
        full_name: string;
        meta_info: string;
        owner: string;
        ticker: string;
        total_max_supply: number;
    };
}

export type ParamsRemoveCustomAssetId = ParamsCustomAssetId;

export interface ResponseRemoveCustomAssetId {
    error_code: string;
}

export interface AssetsInfoWhitelist {
    local_whitelist: AssetInfo[] | undefined;
    global_whitelist: AssetInfo[] | undefined;
    own_assets: AssetInfo[] | undefined;
}

export interface AssetsWhitelistGetResponseData {
    id: number;
    jsonrpc: string;
    result: AssetsInfoWhitelist;
}
