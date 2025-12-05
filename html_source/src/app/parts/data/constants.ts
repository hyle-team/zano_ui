import { BigNumber } from 'bignumber.js';

// \(2^{64}-1\) => (18,446,744,073,709,551,615)
export const MAXIMUM_VALUE = BigNumber('18446744073709551615');
export const MIXIN = 15; // default mixin value
export const RCV_ADDR_QR_SCALE = 1.5; // scale factor for QR code

export const AUDITABLE_WALLET_HELP_PAGE = 'docs.zano.org/docs/use/auditable-wallets-faq';
export const CREATE_NEW_WALLET_HELP_PAGE = 'docs.zano.org/docs/use/wallets/gui-wallet';
export const LOCKED_BALANCE_HELP_PAGE = 'docs.zano.org/docs/use/locked-balance';
export const DOWNLOADS_PAGE_URL = 'zano.org/downloads';
export const ZARCANUM_MIGRATION = 'docs.zano.org/docs/use/zarcanum-migration/';

export const BLOCK_EXPLORER_TX_URL_PREFIX = 'explorer.zano.org/transaction/';
export const BLOCK_EXPLORER_TN_TX_URL_PREFIX = 'testnet-explorer.zano.org/transaction/';

export const MAX_WALLET_NAME_LENGTH = 25;
export const MAX_COMMENT_LENGTH = 255;

export const DEFAULT_ASSET_LOGO_SRC = 'assets/currency-icons/custom_token.svg';

export const DEFAULT_FEE = '0.01';
export const DEFAULT_FEE_BIG = BigNumber('10000000000');
export const DEFAULT_PRICE_ALIAS = BigNumber.sum('100000000000', DEFAULT_FEE_BIG);
