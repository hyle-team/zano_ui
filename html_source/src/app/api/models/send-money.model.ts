export interface SendMoneyParams {
    wallet_id: number;
    address: string;
    amount: string;
    fee: string;
    mixin: number;
    comment: string;
    hide: boolean;
    asset_id: string;
}

export interface SendMoneyFormParams {
    wallet_id: number;
    address: string;
    amount: string;
    isAmountUSD: boolean;
    fee: string;
    mixin: number;
    comment: string;
    hide: boolean;
    asset_id: string;
}
