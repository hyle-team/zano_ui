export interface AppSettings {
    currency: string;
    appLockTime: number;
    appLog: number;
    scale: string;
    appUseTor: boolean;
    visibilityBalance: boolean;
    language: string;
    default_path: string;
    viewedContracts: any[];
    notViewedContracts: any[];
    zanoCompanionForm: {
        zanoCompation: boolean;
        secret: string;
    };
    wallets: any[];
    isDarkTheme: boolean;
    filters: {
        stakingFilters: any;
    };
    localBlacklistsOfVerifiedAssetsByWallets: {
        [key: string]: string[];
    };
}
