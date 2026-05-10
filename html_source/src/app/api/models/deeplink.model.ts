export interface DeeplinkResponse {
    action: 'send';
    address: string;
    amount: string;
    asset_id: string;
    comment?: string;
}
