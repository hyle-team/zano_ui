export interface ProposalDetails {
  expiration_time: number;
  fee_paid_by_a: number;
  mixins: number;
  to_alice: [
    {
      amount: number | string;
      asset_id: string;
    }
  ];
  to_bob: [
    {
      amount: number | string;
      asset_id: string;
    }
  ];
}
