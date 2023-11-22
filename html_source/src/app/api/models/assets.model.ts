export interface Asset {
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

export type Assets = Asset[];

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
