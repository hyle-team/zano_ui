import { BigNumber } from 'bignumber.js';

// \(2^{64}-1\) => (18,446,744,073,709,551,615)
export const MAXIMUM_VALUE: BigNumber = new BigNumber('18446744073709551615');
export const MIXIN = 15; // default mixin value
export const RCV_ADDR_QR_SCALE = 1.5; // scale factor for QR code

export const AUDITABLE_WALLET_HELP_PAGE = 'docs.zano.org/docs/use/auditable-wallets-faq';
export const CREATE_NEW_WALLET_HELP_PAGE = 'docs.zano.org/docs/use/wallets/gui-wallet';
export const LOCKED_BALANCE_HELP_PAGE = 'docs.zano.org/docs/use/locked-balance';
export const DOWNLOADS_PAGE_URL = 'zano.org/downloads';
export const ZARCANUM_MIGRATION = 'docs.zano.org/docs/use/zarcanum-migration/';

export const BLOCK_EXPLORER_TX_URL_PREFIX = 'explorer.zano.org/transaction/';
export const BLOCK_EXPLORER_TN_TX_URL_PREFIX = 'testnet-explorer.zano.org/transaction/';
