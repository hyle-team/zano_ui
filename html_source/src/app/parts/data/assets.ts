import { AssetInfo } from '@api/models/assets.model';

export type ZanoAssetInfo = AssetInfo & { logo: string; price_url: string };

export const ZANO_ASSET_INFO: ZanoAssetInfo = {
    asset_id: 'd6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a',
    current_supply: 0,
    decimal_point: 12,
    full_name: 'Zano',
    logo: 'assets/currency-icons/zano.svg',
    meta_info: '',
    owner: '0000000000000000000000000000000000000000000000000000000000000000',
    price_url: 'https://explorer.zano.org/api/price?asset=zano',
    ticker: 'ZANO',
    total_max_supply: 0
};

export const DEFAULT_ASSET_LOGO_SRC = 'assets/currency-icons/custom_token.svg';
