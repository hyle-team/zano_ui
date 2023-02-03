import { ValidationErrors } from '@angular/forms';

export interface ZanoValidationErrors extends ValidationErrors {
  errorText: string;
}

export const wrongAssetId: ZanoValidationErrors = {
  wrongAssetId: true,
  errorText: 'ASSETS.FORM.ERRORS.WRONG_ASSET_ID',
};
