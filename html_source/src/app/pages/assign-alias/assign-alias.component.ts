import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-assign-alias',
    templateUrl: './assign-alias.component.html',
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        `
    ]
})
export class AssignAliasComponent implements OnInit, OnDestroy {
    public wallet: Wallet = this.variablesService.current_wallet;

    public readonly breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/wallet/history',
            title: this.variablesService.current_wallet.name
        },
        {
            title: 'BREADCRUMBS.ASSIGN_ALIAS'
        }
    ];

    private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    public readonly form = this._fb.group({
        name: this._fb.control(
            '',
            Validators.compose([
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(25),
                Validators.pattern(REG_EXP_REGISTER_ALIAS_NAME)
            ])
        ),
        comment: this._fb.control('', Validators.compose([Validators.maxLength(this.variablesService.maxCommentLength)]))
    });

    public alias = {
        name: '',
        fee: this.variablesService.default_fee,
        price: new BigNumber(0),
        reward: '0',
        rewardOriginal: '0',
        comment: '',
        exists: false
    };

    public canRegister: boolean = false;

    public notEnoughMoney: boolean = false;

    private _destroy$: Subject<void> = new Subject<void>();

    constructor(
        public readonly variablesService: VariablesService,
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

    public beforeSubmit(): void {
        if (!this.canRegister) {
            return;
        }

        if (this.notEnoughMoney) {
            return;
        }

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.form.updateValueAndValidity();
            return;
        }

        this.submit();
    }

    public submit(): void {
        const alias = this._backendService.getWalletAlias(this.wallet.address);
        if (hasOwnProperty(alias, 'name')) {
            this._modalService.prepareModal('info', 'ASSIGN_ALIAS.ONE_ALIAS');
        } else {
            this.alias.comment = this.form.controls.comment.value;
            this._backendService.registerAlias(
                this.wallet.wallet_id,
                this.alias.name,
                this.wallet.address,
                this.alias.fee,
                this.alias.comment,
                this.alias.rewardOriginal,
                async status => {
                    if (status) {
                        this.wallet.wakeAlias = true;
                        this._modalService.prepareModal('info', 'ASSIGN_ALIAS.REQUEST_ADD_REG');
                        await this._ngZone.run(async () => {
                            await this._router.navigate(['/wallet/']);
                        });
                    }
                }
            );
        }
    }

    private _subscribeToNameValueChanges(): void {
        const {
            controls: { name: control }
        } = this.form;

        control.valueChanges.pipe(takeUntil(this._destroy$)).subscribe({
            next: value => {
                this.canRegister = false;
                this.alias.exists = false;
                const newName = value.toLowerCase().replace('@', '');
                if (!(control.errors && control.hasError('pattern')) && newName.length >= 6 && newName.length <= 25) {
                    this._backendService.getAliasInfoByName(newName, status => {
                        this._ngZone.run(() => {
                            this.alias.exists = status;
                        });
                        if (!status) {
                            this.alias.price = new BigNumber(0);
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
            }
        });
    }
}
