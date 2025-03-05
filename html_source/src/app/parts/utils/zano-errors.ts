import { ValidationErrors } from '@angular/forms';

export interface ZanoValidationErrors extends ValidationErrors {
    errorText: string;
}

export const wrongAssetId: ZanoValidationErrors = {
    errorText: 'ASSETS.FORM.ERRORS.WRONG_ASSET_ID'
};

export const wrongPassword: ZanoValidationErrors = {
    errorText: 'Incorrect password'
};

export const insufficientFunds: ZanoValidationErrors = {
    errorText: 'ERRORS.INSUFFICIENT_FUNDS'
};

export const assetHasNotBeenAddedToWallet: ZanoValidationErrors = {
    errorText: 'ERRORS.ASSET_HAS_NOT_BEEN_ADDED_TO_WALLET'
};

export const notFileZanoWallet: ZanoValidationErrors = {
    errorText: 'ERRORS.NOT_FILE_ZANO_WALLET'
};
