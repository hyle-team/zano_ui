export interface CurrentPriceForAsset {
    success: boolean;
    data: { name: string; usd: number; usd_24h_change: number; fiat_prices: { [key: string]: number } } | string;
}

export interface CurrentPriceForAssets {
    [key: string]: CurrentPriceForAsset;
}
