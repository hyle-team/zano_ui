export interface ProposalDetails {
    expiration_time: number;
    fee_paid_by_a: number;
    mixins: number;
    to_initiator: [
        {
            amount: number | string;
            asset_id: string;
        }
    ];
    to_finalizer: [
        {
            amount: number | string;
            asset_id: string;
        }
    ];
}
