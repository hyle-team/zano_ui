import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { Wallet } from '@api/models/wallet.model';
import { IntToMoneyPipe } from '@parts/pipes/int-to-money-pipe/int-to-money.pipe';
import BigNumber from 'bignumber.js';
import { Subject } from 'rxjs';
import { hasOwnProperty } from '@parts/functions/has-own-property';
import { takeUntil } from 'rxjs/operators';
import { REG_EXP_REGISTER_ALIAS_NAME } from '@parts/utils/zano-validators';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { MAX_COMMENT_LENGTH } from '@parts/data/constants';

const NameValidators = [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(25),
    Validators.pattern(REG_EXP_REGISTER_ALIAS_NAME),
];

const CommentValidators = [Validators.maxLength(MAX_COMMENT_LENGTH)];

@Component({
    selector: 'app-assign-alias',
    templateUrl: './assign-alias.component.html',
})
export class AssignAliasComponent implements OnInit, OnDestroy {
    readonly breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/wallet/history',
            title: this.variablesService.current_wallet.name,
        },
        {
            title: 'BREADCRUMBS.ASSIGN_ALIAS',
        },
    ];

    wallet: Wallet = this.variablesService.current_wallet;

    form = this._fb.group({
        name: this._fb.control('', NameValidators),
        comment: this._fb.control('', CommentValidators),
    });

    alias = {
        name: '',
        fee: this.variablesService.default_fee,
        price: this.variablesService.default_price_alias,
        reward: '0',
        rewardOriginal: '0',
        comment: '',
        exists: false,
    };

    canRegister = false;

    notEnoughMoney = false;

    private _destroy$: Subject<void> = new Subject<void>();

    loading = false;

    constructor(
        public readonly variablesService: VariablesService,
        private readonly _fb: NonNullableFormBuilder,
        private readonly _ngZone: NgZone,
        private readonly _router: Router,
        private readonly _backendService: BackendService,
        private readonly _modalService: ModalService,
        private readonly _intToMoney: IntToMoneyPipe
    ) {}

    ngOnInit(): void {
        this._subscribeToNameValueChanges();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    beforeSubmit(): void {
        if (!this.canRegister || this.notEnoughMoney || this.form.invalid) {
            this.form.markAllAsTouched();
            this.form.updateValueAndValidity();
            return;
        }

        const { testnet } = this.variablesService;
        const alias = this.wallet.alias_info;

        if (!testnet && hasOwnProperty(alias, 'name')) {
            this._modalService.prepareModal('info', 'ASSIGN_ALIAS.ONE_ALIAS');
            return;
        }

        this.submit();
    }

    submit(): void {
        this.loading = true;
        this.alias.comment = this.form.controls.comment.value;

        this._backendService.registerAlias(
            this.wallet.wallet_id,
            this.alias.name,
            this.wallet.address,
            this.alias.fee,
            this.alias.comment,
            this.alias.rewardOriginal,
            (status) => {
                this._ngZone.run(() => {
                    this.loading = false;
                    if (status) {
                        this._modalService.prepareModal('info', 'ASSIGN_ALIAS.REQUEST_ADD_REG');
                        this._router.navigate(['/wallet/']).then();
                    }
                });
            }
        );
    }

    private _subscribeToNameValueChanges(): void {
        const {
            controls: { name: control },
        } = this.form;

        control.valueChanges.pipe(takeUntil(this._destroy$)).subscribe({
            next: (value) => {
                this.canRegister = false;
                this.alias.exists = false;
                const newName = value.toLowerCase().replace('@', '');
                if (!(control.errors && control.hasError('pattern')) && newName.length >= 6 && newName.length <= 25) {
                    this._backendService.getAliasInfoByName(newName, (status) => {
                        this._ngZone.run(() => {
                            this.alias.exists = status;
                        });
                        if (!status) {
                            this.alias.price = this.variablesService.default_price_alias;
                            this._backendService.getAliasCoast(newName, (statusPrice, dataPrice) => {
                                this._ngZone.run(() => {
                                    if (statusPrice) {
                                        this.alias.price = BigNumber.sum(dataPrice['coast'], this.variablesService.default_fee_big);
                                    }
                                    const unlocked_balance = new BigNumber(this.wallet.getBalanceByTicker('ZANO')?.unlocked || 0);
                                    this.notEnoughMoney = this.alias.price.isGreaterThan(unlocked_balance);
                                    this.alias.reward = this._intToMoney.transform(this.alias.price);
                                    this.alias.rewardOriginal = this._intToMoney.transform(dataPrice['coast']);
                                    this.canRegister = !this.notEnoughMoney;
                                });
                            });
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
}
