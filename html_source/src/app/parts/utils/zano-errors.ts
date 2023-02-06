import { ValidationErrors } from '@angular/forms';

export interface ZanoValidationErrors extends ValidationErrors {
  errorText: string;
}

export const wrongAssetId: ZanoValidationErrors = {
  errorText: 'ASSETS.FORM.ERRORS.WRONG_ASSET_ID',
};

export const insuficcientFunds: ZanoValidationErrors = {
  errorText: 'ASSETS.FORM.ERRORS.INSUFICCIENT_FUNDS',
};
