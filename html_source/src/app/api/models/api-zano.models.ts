export interface CurrentPriceForAsset {
    success: boolean;
    data: { name: string; usd: number; usd_24h_change: number };
}

export interface CurrentPriceForAssets {
    [key: string]: CurrentPriceForAsset;
}
