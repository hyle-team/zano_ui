export interface Asset {
  asset_id: string;
  balance: number;
  unlocked_balance: number;
}

export interface AssetInfo {
  asset_id: string;
  logo: string;
  ticker: string;
  title: string;
}

export type AssetsInfo = AssetInfo[];

export type Assets = Asset[];
