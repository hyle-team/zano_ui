import { AppSettings } from '@parts/interfaces/app-settings.interface';

export const createDefaultAppSettings = (): AppSettings => ({
    currency: 'usd',
    appLockTime: 15,
    appLog: 0,
    scale: '10px',
    appUseTor: false,
    visibilityBalance: true,
    language: 'en',
    default_path: '/',
    viewedContracts: [],
    notViewedContracts: [],
    zanoCompanionForm: {
        zanoCompation: false,
        secret: '',
    },
    wallets: [],
    isDarkTheme: true,
    filters: {
        stakingFilters: null,
    },
    localBlacklistsOfVerifiedAssetsByWallets: {},
});
