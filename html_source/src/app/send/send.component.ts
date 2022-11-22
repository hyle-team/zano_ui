import {
  Component,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BackendService } from '../_helpers/services/backend.service';
import { VariablesService } from '../_helpers/services/variables.service';
import { ModalService } from '../_helpers/services/modal.service';
import { BigNumber } from 'bignumber.js';
import { MIXIN } from '../_shared/constants';
import { HttpClient } from '@angular/common/http';
import { MoneyToIntPipe } from '../_helpers/pipes/money-to-int.pipe';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AssetInfo, AssetsInfo } from '../_helpers/models/assets';
import { StateKeys, Store } from 'store';

interface WrapInfo {
  tx_cost: {
    usd_needed_for_erc20: string;
    zano_needed_for_erc20: string;
  };
  unwraped_coins_left: string;
}

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit, OnDestroy {
  job_id: number;

  isOpen = false;

  localAliases = [];

  isModalDialogVisible = false;

  isModalDetailsDialogVisible = false;

  hideWalletAddress = false;

  mixin: number;

  wrapInfo: WrapInfo;

  isLoading = true;

  isWrapShown = false;

  currentAliasAddress: string;

  lenghtOfAdress: number;

  additionalOptions = false;

  parentRouting;

  actionData;

  sendForm = new UntypedFormGroup({
    address: new UntypedFormControl('', [
      Validators.required,
      (g: UntypedFormControl): ValidationErrors | null => {
        this.localAliases = [];
        if (g.value) {
          this.currentAliasAddress = '';
          if (g.value.indexOf('@') !== 0) {
            this.isOpen = false;
            this.backend.validateAddress(g.value, (valid_status, data) => {
              this.ngZone.run(() => {
                this.isWrapShown = data.error_code === 'WRAP';
                this.sendForm
                  .get('amount')
                  .setValue(this.sendForm.get('amount').value);
                if (valid_status === false && !this.isWrapShown) {
                  g.setErrors(
                    Object.assign({ address_not_valid: true }, g.errors)
                  );
                } else {
                  if (g.hasError('address_not_valid')) {
                    delete g.errors['address_not_valid'];
                    if (Object.keys(g.errors).length === 0) {
                      g.setErrors(null);
                    }
                  }
                }
              });
            });
            return g.hasError('address_not_valid')
              ? { address_not_valid: true }
              : null;
          } else {
            this.isOpen = true;
            this.localAliases = this.variablesService.aliases.filter(item => {
              return item.name.indexOf(g.value) > -1;
            });
            // eslint-disable-next-line
            if (!/^@?[a-z\d\-]{0,25}$/.test(g.value)) {
              g.setErrors(Object.assign({ alias_not_valid: true }, g.errors));
            } else {
              this.backend.getAliasByName(
                g.value.replace('@', ''),
                (alias_status, alias_data) => {
                  this.ngZone.run(() => {
                    this.currentAliasAddress = alias_data.address;
                    this.lenghtOfAdress = g.value.length;
                    if (alias_status) {
                      if (g.hasError('alias_not_valid')) {
                        delete g.errors['alias_not_valid'];
                        if (Object.keys(g.errors).length === 0) {
                          g.setErrors(null);
                        }
                      }
                    } else {
                      g.setErrors(
                        Object.assign({ alias_not_valid: true }, g.errors)
                      );
                    }
                  });
                }
              );
            }
            return g.hasError('alias_not_valid')
              ? { alias_not_valid: true }
              : null;
          }
        }
        return null;
      },
    ]),
    amount: new UntypedFormControl(undefined, [
      Validators.required,
      (g: UntypedFormControl): ValidationErrors | null => {
        if (!g.value) {
          return null;
        }

        if (g.value === 0) {
          return { zero: true };
        }
        const bigAmount = this.moneyToInt.transform(g.value) as BigNumber;
        if (this.isWrapShown) {
          if (!this.wrapInfo) {
            return { wrap_info_null: true };
          }
          if (
            bigAmount.isGreaterThan(
              new BigNumber(this.wrapInfo.unwraped_coins_left)
            )
          ) {
            return { great_than_unwraped_coins: true };
          }
          if (
            bigAmount.isLessThan(
              new BigNumber(this.wrapInfo.tx_cost.zano_needed_for_erc20)
            )
          ) {
            return { less_than_zano_needed: true };
          }
        }
        return null;
      },
    ]),
    comment: new UntypedFormControl(''),
    assets: new FormControl<AssetInfo | null>(null, Validators.compose([])),
    mixin: new UntypedFormControl(MIXIN, Validators.required),
    fee: new UntypedFormControl(this.variablesService.default_fee, [
      Validators.required,
      (g: UntypedFormControl): ValidationErrors | null => {
        if (
          new BigNumber(g.value).isLessThan(this.variablesService.default_fee)
        ) {
          return { less_min: true };
        }
        return null;
      },
    ]),
    hide: new UntypedFormControl(false),
  });

  defaultImgSrc = 'assets/icons/currency-icons/custom_token.svg';

  get assetsInfo$(): Observable<AssetsInfo | null | undefined> {
    return this.store.select<AssetsInfo | null | undefined>(
      StateKeys.assetsInfo
    );
  }

  private dLActionSubscribe;

  constructor(
    private backend: BackendService,
    public variablesService: VariablesService,
    private modalService: ModalService,
    private ngZone: NgZone,
    private http: HttpClient,
    private moneyToInt: MoneyToIntPipe,
    private store: Store
  ) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement): void {
    if (targetElement.id !== 'send-address' && this.isOpen) {
      this.isOpen = false;
    }
  }

  ngOnInit(): void {
    this.mixin =
      this.variablesService.currentWallet.send_data['mixin'] || MIXIN;
    if (this.variablesService.currentWallet.is_auditable) {
      this.mixin = 0;
      this.sendForm.controls['mixin'].disable();
    }
    this.hideWalletAddress =
      this.variablesService.currentWallet.is_auditable &&
      !this.variablesService.currentWallet.is_watch_only;
    if (this.hideWalletAddress) {
      this.sendForm.controls['hide'].disable();
    }
    this.sendForm.reset({
      address: this.variablesService.currentWallet.send_data['address'],
      amount: this.variablesService.currentWallet.send_data['amount'],
      comment: this.variablesService.currentWallet.send_data['comment'],
      mixin: this.mixin,
      fee:
        this.variablesService.currentWallet.send_data['fee'] ||
        this.variablesService.default_fee,
      hide: this.variablesService.currentWallet.send_data['hide'] || false,
    });

    this.getWrapInfo();
    this.dLActionSubscribe = this.variablesService.sendActionData$.subscribe(
      res => {
        if (res.action === 'send') {
          this.actionData = res;
          setTimeout(() => {
            this.fillDeepLinkData();
          }, 100);
          this.variablesService.sendActionData$.next({});
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.dLActionSubscribe.unsubscribe();
    this.variablesService.currentWallet.send_data = {
      address: this.sendForm.get('address').value,
      amount: this.sendForm.get('amount').value,
      comment: this.sendForm.get('comment').value,
      mixin: this.sendForm.get('mixin').value,
      fee: this.sendForm.get('fee').value,
      hide: this.sendForm.get('hide').value,
    };
    this.actionData = {};
  }

  getShorterAddress(): string {
    const tempArr = this.currentAliasAddress.split('');
    return (
      this.currentAliasAddress.split('', 13).join('') +
      '...' +
      tempArr.splice(tempArr.length - 4, 4).join('')
    );
  }

  addressMouseDown(e): void {
    if (
      e['button'] === 0 &&
      this.sendForm.get('address').value &&
      this.sendForm.get('address').value.indexOf('@') === 0
    ) {
      this.isOpen = true;
    }
  }

  setAlias(alias): void {
    this.sendForm.get('address').setValue(alias);
  }

  showDialog(): void {
    this.isModalDialogVisible = true;
  }

  confirmed(confirmed: boolean): void {
    this.isModalDialogVisible = false;
    if (confirmed) {
      this.onSend();
    }
  }

  fillDeepLinkData(): void {
    this.additionalOptions = true;
    this.sendForm.reset({
      address: this.actionData.address,
      amount: null,
      comment: this.actionData.comment || this.actionData.comments || '',
      mixin: this.actionData.mixins || this.mixin,
      fee: this.actionData.fee || this.variablesService.default_fee,
      hide: this.actionData.hide_sender === 'true',
    });
  }

  addressToLowerCase(): void | null {
    const control = this.sendForm.get('address');
    const value = control.value;
    const condition = value.indexOf('@') === 0;
    return condition ? control.patchValue(value.toLowerCase()) : null;
  }

  onSend(): void {
    if (this.sendForm.valid) {
      if (this.sendForm.get('address').value.indexOf('@') !== 0) {
        this.backend.validateAddress(
          this.sendForm.get('address').value,
          (valid_status, data) => {
            if (valid_status === false && !(data.error_code === 'WRAP')) {
              this.ngZone.run(() => {
                this.sendForm
                  .get('address')
                  .setErrors({ address_not_valid: true });
              });
            } else {
              this.backend.sendMoney(
                this.variablesService.currentWallet.wallet_id,
                this.sendForm.get('address').value,
                this.sendForm.get('amount').value,
                this.sendForm.get('fee').value,
                this.sendForm.get('mixin').value,
                this.sendForm.get('comment').value,
                this.sendForm.get('hide').value,
                job_id => {
                  this.ngZone.run(() => {
                    this.job_id = job_id;
                    this.isModalDetailsDialogVisible = true;
                    this.variablesService.currentWallet.send_data = {
                      address: null,
                      amount: null,
                      comment: null,
                      mixin: null,
                      fee: null,
                      hide: null,
                    };
                    this.sendForm.reset({
                      address: null,
                      amount: null,
                      comment: null,
                      mixin: this.mixin,
                      fee: this.variablesService.default_fee,
                      hide: false,
                    });
                    this.sendForm.markAsUntouched();
                  });
                }
              );
            }
          }
        );
      } else {
        this.backend.getAliasByName(
          this.sendForm.get('address').value.replace('@', ''),
          (alias_status, alias_data) => {
            this.ngZone.run(() => {
              if (alias_status === false) {
                this.ngZone.run(() => {
                  this.sendForm
                    .get('address')
                    .setErrors({ alias_not_valid: true });
                });
              } else {
                this.backend.sendMoney(
                  this.variablesService.currentWallet.wallet_id,
                  alias_data.address, // this.sendForm.get('address').value,
                  this.sendForm.get('amount').value,
                  this.sendForm.get('fee').value,
                  this.sendForm.get('mixin').value,
                  this.sendForm.get('comment').value,
                  this.sendForm.get('hide').value,
                  job_id => {
                    this.ngZone.run(() => {
                      this.job_id = job_id;
                      this.isModalDetailsDialogVisible = true;
                      this.variablesService.currentWallet.send_data = {
                        address: null,
                        amount: null,
                        comment: null,
                        mixin: null,
                        fee: null,
                        hide: null,
                      };
                      this.sendForm.reset({
                        address: null,
                        amount: null,
                        comment: null,
                        mixin: this.mixin,
                        fee: this.variablesService.default_fee,
                        hide: false,
                      });
                      this.sendForm.markAsUntouched();
                    });
                  }
                );
              }
            });
          }
        );
      }
    }
  }

  toggleOptions(): void {
    this.additionalOptions = !this.additionalOptions;
  }

  getReceivedValue(): number | BigNumber {
    const amount = this.moneyToInt.transform(this.sendForm.value.amount);
    const needed = new BigNumber(this.wrapInfo.tx_cost.zano_needed_for_erc20);
    if (amount && needed) {
      return (amount as BigNumber).minus(needed);
    }
    return 0;
  }

  handeCloseDetailsModal(): void {
    this.isModalDetailsDialogVisible = false;
    this.job_id = null;
  }

  private getWrapInfo(): void {
    this.http
      .get<WrapInfo>('https://wrapped.zano.org/api2/get_wrap_info')
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(info => {
        this.wrapInfo = info;
      });
  }
}
