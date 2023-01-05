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
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { BigNumber } from 'bignumber.js';
import { MIXIN } from '@parts/data/constants';
import { HttpClient } from '@angular/common/http';
import { MoneyToIntPipe } from '@parts/pipes/money-to-int-pipe/money-to-int.pipe';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Asset } from '@api/models/assets.model';

interface WrapInfo {
  tx_cost: {
    usd_needed_for_erc20: string;
    zano_needed_for_erc20: string;
  };
  unwraped_coins_left: string;
}

@Component({
  selector: 'app-send',
  template: `
    <div class="container scrolled-content" fxFlex="1 1 auto">
      <form
        (ngSubmit)="showDialog()"
        *ngIf="!isLoading"
        [formGroup]="sendForm"
        class="form"
        fxFlex="0 1 50rem"
        fxLayout="column"
        fxLayoutAlign="start stretch"
      >
        <div class="form__field--row">
          <div class="form__field form__field-dropdown">
            <label for="send-address">{{ 'SEND.ADDRESS' | translate }}</label>
            <input
              (contextmenu)="variablesService.onContextMenu($event)"
              (input)="addressToLowerCase()"
              (mousedown)="addressMouseDown($event)"
              [placeholder]="'PLACEHOLDERS.ADRESS_PLACEHOLDER' | translate"
              class="form__field--input"
              formControlName="address"
              id="send-address"
              type="text"
            />

            <div
              *ngIf="isOpen && !!localAliases.length"
              class="dropdown py-0_5 border-radius-0_8-rem bg-light-blue-details"
            >
              <div
                (click)="setAlias(item.name)"
                *ngFor="let item of localAliases"
                class="item"
              >
                <div
                  [class.available]="
                    item.name.length >= 2 && item.name.length <= 6
                  "
                  [class.pl-1]="item.name.length > 6"
                  class="alias"
                >
                  <div class="text-ellipsis">{{ item.name }}</div>
                </div>
              </div>
            </div>

            <div
              *ngIf="
                sendForm.controls['address'].invalid &&
                (sendForm.controls['address'].dirty ||
                  sendForm.controls['address'].touched)
              "
              class="error"
            >
              <div
                *ngIf="sendForm.controls['address'].errors['address_not_valid']"
              >
                {{ 'SEND.FORM_ERRORS.ADDRESS_NOT_VALID' | translate }}
              </div>
              <div
                *ngIf="sendForm.controls['address'].errors['alias_not_valid']"
              >
                {{ 'SEND.FORM_ERRORS.ALIAS_NOT_VALID' | translate }}
              </div>
              <div *ngIf="sendForm.controls['address'].hasError('required')">
                {{ 'SEND.FORM_ERRORS.ADDRESS_REQUIRED' | translate }}
              </div>
            </div>
            <div *ngIf="currentAliasAddress" class="info text-ellipsis">
              <span>{{ currentAliasAddress | zanoShortString }}</span>
            </div>
          </div>

          <div class="form__field">
            <label for="send-amount">{{ 'SEND.AMOUNT' | translate }}</label>
            <input
              (contextmenu)="variablesService.onContextMenu($event)"
              [placeholder]="'PLACEHOLDERS.AMOUNT_PLACEHOLDER' | translate"
              appInputValidate="money"
              class="form__field--input"
              formControlName="amount"
              id="send-amount"
              type="text"
            />
            <div
              *ngIf="
                sendForm.controls['amount'].invalid &&
                (sendForm.controls['amount'].dirty ||
                  sendForm.controls['amount'].touched)
              "
              class="error"
            >
              <div *ngIf="sendForm.controls['amount'].errors['zero']">
                {{ 'SEND.FORM_ERRORS.AMOUNT_ZERO' | translate }}
              </div>
              <div
                *ngIf="
                  sendForm.controls['amount'].errors[
                    'great_than_unwraped_coins'
                  ]
                "
              >
                {{ 'SEND.FORM_ERRORS.GREAT_THAN_UNWRAPPED_COINS' | translate }}
              </div>
              <div
                *ngIf="
                  sendForm.controls['amount'].errors['less_than_zano_needed']
                "
              >
                {{ 'SEND.FORM_ERRORS.LESS_THAN_ZANO_NEEDED' | translate }}
              </div>
              <div *ngIf="sendForm.controls['amount'].errors['wrap_info_null']">
                {{ 'SEND.FORM_ERRORS.WRAP_INFO_NULL' | translate }}
              </div>
              <div *ngIf="sendForm.controls['amount'].hasError('required')">
                {{ 'SEND.FORM_ERRORS.AMOUNT_REQUIRED' | translate }}
              </div>
            </div>
          </div>
        </div>

        <div class="form__field">
          <label for="send-comment">{{ 'SEND.COMMENT' | translate }}</label>
          <input
            (contextmenu)="variablesService.onContextMenu($event)"
            [maxLength]="variablesService.maxCommentLength"
            class="form__field--input"
            formControlName="comment"
            id="send-comment"
            placeholder="{{ 'PLACEHOLDERS.COMMENT_PLACEHOLDER' | translate }}"
            type="text"
          />
          <div
            *ngIf="
              sendForm.get('comment').value &&
              sendForm.get('comment').value.length >=
                variablesService.maxCommentLength
            "
            class="error"
          >
            {{ 'SEND.FORM_ERRORS.MAX_LENGTH' | translate }}
          </div>
        </div>

        <div
          *ngIf="isWrapShown && wrapInfo && !isLoading"
          class="wrap mt-2 mb-2 p-2"
        >
          <div class="title">
            {{ 'SEND.WRAP.TITLE' | translate }}
            <i class="icon info-circle"></i>
          </div>
          <div class="text-wrap">
            {{ 'SEND.WRAP.MAIN_TEXT' | translate }}
          </div>
          <div class="title">{{ 'SEND.WRAP.ESTIMATE' | translate }}</div>
          <table class="text-wrap">
            <tr>
              <td>{{ 'SEND.WRAP.WILL_RECEIVE' | translate }}</td>
              <td *ngIf="!sendForm.controls['amount'].errors">
                {{ getReceivedValue() | intToMoney }}
                {{ 'SEND.WRAP.wZANO' | translate }}
              </td>
              <td *ngIf="sendForm.controls['amount'].errors">-</td>
            </tr>
            <tr>
              <td>{{ 'SEND.WRAP.FEE' | translate }}</td>
              <td>
                {{ wrapInfo?.tx_cost?.zano_needed_for_erc20 | intToMoney : 3 }}
                {{ 'SEND.WRAP.ZANO' | translate }}
                ({{ '$' + wrapInfo.tx_cost?.usd_needed_for_erc20 }})
              </td>
            </tr>
          </table>
        </div>

        <div class="form__field">
          <label>
            {{ 'Asset' | translate }}
          </label>
          <ng-select
            [clearable]="false"
            [items]="variablesService.currentWallet.balances"
            [searchable]="false"
            formControlName="asset"
            class="custom-select with-circle"
          >
            <ng-template ng-option-tmp ng-label-tmp let-asset="item">
              <img
                height="15"
                width="15"
                [src]="
                  (asset | getWhiteAssetInfo | async)?.logo || defaultImgSrc
                "
                [alt]="asset.asset_info.ticker"
                defaultImgAlt="default"
                [defaultImgSrc]="defaultImgSrc"
                appDefaultImg
              />
              {{ asset.asset_info.full_name || '---' }}
            </ng-template>
          </ng-select>
          <div
            *ngIf="
              sendForm.controls['asset'].invalid &&
              (sendForm.controls['asset'].dirty ||
                sendForm.controls['asset'].touched)
            "
            class="error"
          >
            <div *ngIf="sendForm.controls['asset'].hasError('required')">
              {{ 'Required field' | translate }}
            </div>
          </div>
        </div>

        <div class="details mb-2">
          <button
            (click)="toggleOptions()"
            [class.border-radius-all]="!additionalOptions"
            class="header"
            type="button"
          >
            <span>{{ 'SEND.DETAILS' | translate }}</span>
            <i
              [class.dropdown-arrow-down]="!additionalOptions"
              [class.dropdown-arrow-up]="additionalOptions"
              class="icon ml-1"
            ></i>
          </button>

          <div *ngIf="additionalOptions" class="content">
            <div class="form__field--row">
              <div class="form__field">
                <label for="send-mixin">{{ 'SEND.MIXIN' | translate }}</label>
                <input
                  (contextmenu)="variablesService.onContextMenu($event)"
                  [placeholder]="'PLACEHOLDERS.AMOUNT_PLACEHOLDER' | translate"
                  appInputValidate="integer"
                  class="form__field--input"
                  formControlName="mixin"
                  id="send-mixin"
                  type="text"
                />
                <div
                  *ngIf="
                    sendForm.controls['mixin'].invalid &&
                    (sendForm.controls['mixin'].dirty ||
                      sendForm.controls['mixin'].touched)
                  "
                  class="error"
                >
                  <div *ngIf="sendForm.controls['mixin'].hasError('required')">
                    {{ 'SEND.FORM_ERRORS.AMOUNT_REQUIRED' | translate }}
                  </div>
                </div>
              </div>

              <div class="form__field">
                <label for="send-fee">{{ 'SEND.FEE' | translate }}</label>
                <input
                  (contextmenu)="variablesService.onContextMenu($event)"
                  [placeholder]="'PLACEHOLDERS.FEE_PLACEHOLDER' | translate"
                  appInputValidate="money"
                  class="form__field--input"
                  formControlName="fee"
                  id="send-fee"
                  type="text"
                />
                <div
                  *ngIf="
                    sendForm.controls['fee'].invalid &&
                    (sendForm.controls['fee'].dirty ||
                      sendForm.controls['fee'].touched)
                  "
                  class="error"
                >
                  <div *ngIf="sendForm.controls['fee'].errors['less_min']">
                    {{
                      'SEND.FORM_ERRORS.FEE_MINIMUM'
                        | translate : { fee: variablesService.default_fee }
                    }}
                  </div>
                  <div *ngIf="sendForm.controls['fee'].hasError('required')">
                    {{ 'SEND.FORM_ERRORS.FEE_REQUIRED' | translate }}
                  </div>
                </div>
              </div>
            </div>

            <app-checkbox
              [label]="'SEND.HIDE' | translate"
              [value]="hideWalletAddress || sendForm.controls['hide'].value"
              class="mt-1"
              formControlName="hide"
            ></app-checkbox>
          </div>
        </div>

        <button
          [disabled]="!sendForm.valid || !variablesService.currentWallet.loaded"
          class="primary big max-w-19-rem w-100"
          type="submit"
        >
          {{ 'SEND.BUTTON' | translate }}
        </button>
      </form>
    </div>

    <app-send-modal
      (confirmed)="confirmed($event)"
      *ngIf="isModalDialogVisible"
      [form]="sendForm"
    ></app-send-modal>

    <app-send-details-modal
      (eventClose)="handeCloseDetailsModal()"
      *ngIf="isModalDetailsDialogVisible"
      [job_id]="job_id"
    ></app-send-details-modal>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: auto;
        display: flex;
      }
    `,
  ],
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
    asset: new FormControl<Asset | null>(
      null,
      Validators.compose([Validators.required])
    ),
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

  private destroy$ = new Subject<void>();

  constructor(
    private backend: BackendService,
    public variablesService: VariablesService,
    private modalService: ModalService,
    private ngZone: NgZone,
    private http: HttpClient,
    private moneyToInt: MoneyToIntPipe
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
      asset: this.variablesService.currentWallet.getBalanceByTicker('ZANO'),
      comment: this.variablesService.currentWallet.send_data['comment'],
      mixin: this.mixin,
      fee:
        this.variablesService.currentWallet.send_data['fee'] ||
        this.variablesService.default_fee,
      hide: this.variablesService.currentWallet.send_data['hide'] || false,
    });

    this.getWrapInfo();
    this.variablesService.sendActionData$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          if (res.action === 'send') {
            this.actionData = res;
            setTimeout(() => {
              this.fillDeepLinkData();
            }, 100);
            this.variablesService.sendActionData$.next({});
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      const { asset } = this.sendForm.value;
      const { wallet_id } = this.variablesService.currentWallet;
      let asset_id = null;
      if (asset.asset_info.ticker !== 'ZANO') {
        asset_id = asset.asset_info.asset_id;
      }

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
                wallet_id,
                this.sendForm.get('address').value,
                this.sendForm.get('amount').value,
                this.sendForm.get('fee').value,
                this.sendForm.get('mixin').value,
                this.sendForm.get('comment').value,
                this.sendForm.get('hide').value,
                asset_id,
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
                  wallet_id,
                  alias_data.address, // this.sendForm.get('address').value,
                  this.sendForm.get('amount').value,
                  this.sendForm.get('fee').value,
                  this.sendForm.get('mixin').value,
                  this.sendForm.get('comment').value,
                  this.sendForm.get('hide').value,
                  asset_id,
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
      .subscribe({
        next: info => {
          this.wrapInfo = info;
        },
      });
  }
}
