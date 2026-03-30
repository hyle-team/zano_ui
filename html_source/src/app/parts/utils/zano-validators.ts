import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { notFileZanoWallet, ZanoValidationErrors } from '@parts/utils/zano-errors';
import { MIMETypes } from '@parts/utils/MIME-types';
import { BigNumber } from 'bignumber.js';
import { intToMoney } from '@parts/functions/int-to-money';
import { WrapInfo } from '@api/models/wrap-info';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap, take } from 'rxjs/operators';
import { ResponseCallRpc } from '@api/models/call_rpc.model';
import { ALIAS_PREFIX, LEGACY_PREFIX } from '@parts/data/constants';
import { ResultSplitIntegratedAddress } from '@api/models/rpc.models';

export const REG_EXP_HEX = /^[a-f0-9]{64}$/i;
export const REG_EXP_ALIAS_NAME = /^@?[a-z\d.-]{2,25}$/;
export const REG_EXP_REGISTER_ALIAS_NAME = /^@?[a-z\d.-]{6,25}$/;
export const REG_EXP_PASSWORD = /^[A-Za-z0-9!@#$%^&*()_+\-={}\[\]|:;"'<>,.?/~]{1,40}$/;

export class ZanoValidators {
    static hash({ value }: AbstractControl): ValidationErrors | null {
        return REG_EXP_HEX.test(value) ? null : { invalidHash: true };
    }

    static formMatch(firstControlName: string, secondControlName: string, nameErrorKey = 'mismatch'): ValidatorFn {
        return (abstractControl: AbstractControl): ValidationErrors | null =>
            abstractControl.get(firstControlName).value === abstractControl.get(secondControlName).value ? null : { [nameErrorKey]: true };
    }

    static duplicate(valuesForComparisons: string | string[], exception: string = ''): ValidatorFn {
        return ({ value }: AbstractControl): ValidationErrors | null => {
            const errorObject = { duplicate: true };
            let error = null;

            if (exception && value === exception) {
                return null;
            }

            if (typeof value === 'string' && value === valuesForComparisons) {
                error = errorObject;
            }

            if (Array.isArray(valuesForComparisons) && valuesForComparisons.includes(value)) {
                error = errorObject;
            }

            return error;
        };
    }

    static zeroValue(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        const isZero = new BigNumber(value).eq(0);

        return isZero ? { zero: true } : null;
    }

    static greaterMax(maxValue: string | number | BigNumber, decimalPoint: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            const max = new BigNumber(intToMoney(maxValue, decimalPoint));
            const amount = new BigNumber(control.value);

            return amount.isGreaterThan(max) ? { greater_max: { max: max.toString() } } : null;
        };
    }

    static lessMin(minValue: string | BigNumber): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = new BigNumber(control.value);
            const min = new BigNumber(minValue);

            return value.isLessThan(min) ? { less_min: true } : null;
        };
    }
}

export const filePathWalletValidator = (path: string): ZanoValidationErrors | null => {
    if (!(path && path.trim().length)) {
        return null;
    }

    const positionLastSlash = path.lastIndexOf('/');
    const fileName = path.slice(positionLastSlash + 1);

    if (!(fileName && fileName.trim().length)) {
        return null;
    }

    if (fileName) {
        let index = 0;
        while (index < MIMETypes.length) {
            if (fileName.includes(MIMETypes[index])) {
                return notFileZanoWallet;
            }
            index++;
        }
    }

    return null;
};

export function validateWrapInfo(data: WrapInfo): boolean {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    if (typeof data.unwraped_coins_left !== 'string') {
        return false;
    }

    if (typeof data.tx_cost !== 'object' || data.tx_cost === null) {
        return false;
    }

    if (typeof data.tx_cost.usd_needed_for_erc20 !== 'string') {
        return false;
    }

    if (typeof data.tx_cost.zano_needed_for_erc20 !== 'string') {
        return false;
    }

    return true;
}

function validateAlias(
    backendService: BackendService,
    ngZone: NgZone,
    aliasAddressControl: AbstractControl,
    value: string
): Observable<ValidationErrors | null> {
    if (!REG_EXP_ALIAS_NAME.test(value)) {
        return of({ alias_not_valid: true });
    }
    const name: string = value.replace(ALIAS_PREFIX, '');

    return new Observable((observer) => {
        backendService.getAliasInfoByName(name, (status: boolean, data: any) => {
            ngZone.run(() => {
                if (status) {
                    aliasAddressControl?.patchValue(data.address);
                    observer.next(null);
                } else {
                    observer.next({ alias_not_found: true });
                }
                observer.complete();
            });
        });
    });
}

function validateAddress(
    backendService: BackendService,
    ngZone: NgZone,
    isVisibleWrapInfoControl: AbstractControl,
    address: string
): Observable<ValidationErrors | null> {
    return new Observable(observer => {
        backendService.validateAddress(address, (status: boolean, data: any) => {
            ngZone.run(() => {
                const isVisibleWrapInfo = data?.error_code === 'WRAP';
                isVisibleWrapInfoControl?.patchValue(isVisibleWrapInfo);

                if (!status && !isVisibleWrapInfo) {
                    observer.next({ address_not_valid: true });
                } else {
                    observer.next(null);
                }
                observer.complete();
            });
        });
    });
}

function validateIntegratedAddress(
    backendService: BackendService,
    ngZone: NgZone,
    wallet_id: number,
    address: string
): Observable<ValidationErrors | null> {
    return new Observable(observer => {
        backendService.splitIntegratedAddress(wallet_id, address, (_, response_data: ResponseCallRpc<ResultSplitIntegratedAddress>) => {
            ngZone.run(() => {
                if (response_data.result?.payment_id?.length > 16) {
                    observer.next({ integrated_payment_id_is_invalid: true });
                } else {
                    observer.next(null);
                }
                observer.complete();
            });
        });
    });
}

export function createAddressAliasValidator(
    backendService: BackendService,
    variablesService: VariablesService,
    ngZone: NgZone,
    aliasAddressControl: AbstractControl,
    isVisibleWrapInfoControl: AbstractControl
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const value = control.value;

        aliasAddressControl?.patchValue('');
        isVisibleWrapInfoControl?.patchValue(false);

        if (!value) {
            return of(null);
        }

        if (value.startsWith(ALIAS_PREFIX)) {
            return validateAlias(backendService, ngZone, aliasAddressControl, value);
        }

        const address = value.startsWith(LEGACY_PREFIX) ? value.replace(LEGACY_PREFIX, '') : value;
        const addressValidation$ = validateAddress(backendService, ngZone, isVisibleWrapInfoControl, address);

        return addressValidation$.pipe(
            switchMap(addressErrors => {
                if (addressErrors) {
                    return of(addressErrors);
                }
                if (isVisibleWrapInfoControl.value || value.startsWith(LEGACY_PREFIX)) {
                    return of(null);
                }
                const {
                    current_wallet: { wallet_id },
                } = variablesService;
                return validateIntegratedAddress(backendService, ngZone, wallet_id, address);
            })
        );
    };
}

export function debouncedAsyncValidator(validator: AsyncValidatorFn, dueTime: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return control.valueChanges.pipe(
            startWith(control.value),
            debounceTime(dueTime),
            distinctUntilChanged(),
            switchMap(() => validator(control)),
            take(1)
        );
    };
}
