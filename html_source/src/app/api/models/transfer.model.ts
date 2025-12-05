export interface TransferDestination {
    address: string;
    amount: string;
    asset_id: string;
}

export interface TransferParams {
    wallet_id: number;
    destinations: TransferDestination[];
    fee: string;
    comment: string;
}
