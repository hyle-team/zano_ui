import { AssetBalances } from '@api/models/assets.model';

export interface WalletInfo {
    address: string;
    balances: AssetBalances;
    current_pos_attempts: number;
    est_iterations_per_pos_block: number;
    has_bare_unspent_outputs: boolean;
    is_auditable: boolean;
    is_watch_only: boolean;
    mined_total: number;
    path: string;
    view_sec_key: string;
}
