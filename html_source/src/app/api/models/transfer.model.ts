export interface TransferDestination {
    address: string;
    amount: string;
    asset_id: string;
}

export interface TransferParams {
    wallet_id: number;
    destinations: TransferDestination[];
    mixin: number;
    lock_time: number;
    fee: string;
    comment: string;
    push_payer: boolean;
    hide_receiver: boolean;
}

export interface TransferDestinationsFormValue {
    address: string;
    amount: string;
    is_currency_input_mode: boolean;
    asset_id: string;
    is_visible_wrap_info: boolean;
    alias_address: string;
}

export interface TransferFormValue {
    wallet_id: number;
    destinations: TransferDestinationsFormValue[];
    comment: string;
    asset_id: string;
    mixin: number;
    lock_time: number;
    fee: string;
    push_payer: boolean;
    hide_receiver: boolean;
}
