import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { Wallet } from '@api/models/wallet.model';
import { MoneyToIntPipe } from '@parts/pipes/money-to-int-pipe/money-to-int.pipe';
import { IntToMoneyPipe } from '@parts/pipes/int-to-money-pipe/int-to-money.pipe';
import BigNumber from 'bignumber.js';
import { Subject } from 'rxjs';
import { hasOwnProperty } from '@parts/functions/hasOwnProperty';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-assign-alias',
  templateUrl: './assign-alias.component.html',
  styleUrls: ['./assign-alias.component.scss'],
})
export class AssignAliasComponent implements OnInit, OnDestroy {
  wallet: Wallet;

  assignForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [
      Validators.required,
      // eslint-disable-next-line
      Validators.pattern(/^@?[a-z\d\.\-]{6,25}$/),
    ]),
    comment: new UntypedFormControl('', [
      (g: UntypedFormControl): ValidationErrors | null => {
        if (g.value > this.variablesService.maxCommentLength) {
          return { maxLength: true };
        } else {
          return null;
        }
      },
    ]),
  });

  alias = {
    name: '',
    fee: this.variablesService.default_fee,
    price: new BigNumber(0),
    reward: '0',
    rewardOriginal: '0',
    comment: '',
    exists: false,
  };

  canRegister = false;

  notEnoughMoney = false;

  private destroy$ = new Subject<void>();

  constructor(
    public variablesService: VariablesService,
    private ngZone: NgZone,
    private router: Router,
    private backend: BackendService,
    private modalService: ModalService,
    private moneyToInt: MoneyToIntPipe,
    private intToMoney: IntToMoneyPipe
  ) {}

  ngOnInit(): void {
    this.wallet = this.variablesService.currentWallet;
    this.assignForm
      .get('name')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.canRegister = false;
          this.alias.exists = false;
          const newName = value.toLowerCase().replace('@', '');
          if (
            !(
              this.assignForm.controls['name'].errors &&
              hasOwnProperty(this.assignForm.controls['name'].errors, 'pattern')
            ) &&
            newName.length >= 6 &&
            newName.length <= 25
          ) {
            this.backend.getAliasByName(newName, status => {
              this.ngZone.run(() => {
                this.alias.exists = status;
              });
              if (!status) {
                this.alias.price = new BigNumber(0);
                this.backend.getAliasCoast(
                  newName,
                  (statusPrice, dataPrice) => {
                    this.ngZone.run(() => {
                      if (statusPrice) {
                        this.alias.price = BigNumber.sum(
                          dataPrice['coast'],
                          this.variablesService.default_fee_big
                        );
                      }
                      // this.notEnoughMoney = this.alias.price.isGreaterThan(
                      //   this.wallet.unlocked_balance
                      // );
                      this.notEnoughMoney = false;
                      this.alias.reward = this.intToMoney.transform(
                        this.alias.price,
                        false
                      );
                      this.alias.rewardOriginal = this.intToMoney.transform(
                        dataPrice['coast'],
                        false
                      );
                      this.canRegister = !this.notEnoughMoney;
                    });
                  }
                );
              } else {
                this.notEnoughMoney = false;
                this.alias.reward = '0';
                this.alias.rewardOriginal = '0';
              }
            });
          } else {
            this.notEnoughMoney = false;
            this.alias.reward = '0';
            this.alias.rewardOriginal = '0';
          }
          this.alias.name = newName;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  assignAlias(): void {
    const alias = this.backend.getWalletAlias(this.wallet.address);
    if (hasOwnProperty(alias, 'name')) {
      this.modalService.prepareModal('info', 'ASSIGN_ALIAS.ONE_ALIAS');
    } else {
      this.alias.comment = this.assignForm.get('comment').value;
      this.backend.registerAlias(
        this.wallet.wallet_id,
        this.alias.name,
        this.wallet.address,
        this.alias.fee,
        this.alias.comment,
        this.alias.rewardOriginal,
        status => {
          if (status) {
            this.wallet.wakeAlias = true;
            this.modalService.prepareModal(
              'info',
              'ASSIGN_ALIAS.REQUEST_ADD_REG'
            );
            this.ngZone.run(() => {
              this.router.navigate(['/wallet/']);
            });
          }
        }
      );
    }
  }
}
