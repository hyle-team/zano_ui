export interface AssetDescriptor {
    current_supply?: number | string;
    decimal_point: number;
    full_name: string;
    hidden_supply: boolean;
    meta_info: string;
    owner?: string;
    ticker: string;
    total_max_supply: number | string;
}

export interface Destination {
    address: string;
    amount: number | string;
    asset_id?: string;
}

export type Destinations = Destination[];

export interface DeployAssetParams {
    asset_descriptor: AssetDescriptor;
    destinations: Destinations;
}

export interface ResponseDeployAsset {
    id: number;
    jsonrpc: string;
    result: {
        new_asset_id: string;
        result_tx: string;
    };
}

export interface UpdateAssetParams {
    asset_descriptor: Partial<AssetDescriptor>;
    asset_id: string;
}

export interface EmitParams {
    destinations: Destinations;
    asset_id: string;
}

export interface ResponseUpdateAsset {
    id: number;
    jsonrpc: string;
    result: {
        result_tx: string;
    };
}
