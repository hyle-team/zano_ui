import { Component, ElementRef, inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { Wallet } from '@api/models/wallet.model';
import { hasOwnProperty } from '@parts/functions/has-own-property';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { REG_EXP_PASSWORD, ZanoValidators } from '@parts/utils/zano-validators';
import { WalletsService } from '@parts/services/wallets.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmModalComponent, ConfirmModalData } from '@parts/modals/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    @ViewChild('errorsSection', { static: true }) errorsSection: ElementRef;

    private readonly _fb = inject(NonNullableFormBuilder);

    submitLoading = false;

    resetLoading = false;

    regMasterPassForm = this._fb.group(
        {
            password: this._fb.control('', Validators.pattern(REG_EXP_PASSWORD)),
            confirmation: this._fb.control(''),
        },
        {
            validators: [ZanoValidators.formMatch('password', 'confirmation')],
        }
    );

    loginForm = this._fb.group({
        password: this._fb.control(''),
    });

    type = 'reg';

    private readonly _destroy$ = new Subject<void>();

    constructor(
        public variablesService: VariablesService,
        public walletsService: WalletsService,
        private route: ActivatedRoute,
        private router: Router,
        private backend: BackendService,
        private ngZone: NgZone,
        private matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this._destroy$)).subscribe({
            next: (params) => {
                if (params.type) {
                    this.type = params.type;
                }
            },
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    onSubmitCreatePass(): void {
        if (this.regMasterPassForm.valid) {
            this.variablesService.appPass = this.regMasterPassForm.get('password').value; // the pass what was written in input of login form by user

            this.backend.setMasterPassword({ pass: this.variablesService.appPass }, (status, data) => {
                if (status) {
                    this.backend.storeSecureAppData({
                        pass: this.variablesService.appPass,
                    });
                    this.variablesService.appLogin = true;
                    this.variablesService.dataIsLoaded = true;
                    if (this.variablesService.settings.appLockTime) {
                        this.variablesService.startCountdown();
                    }
                    this.ngZone.run(() => {
                        this.router.navigate(['/']);
                    });
                } else {
                    console.log(data['error_code']);
                }
            });
        }
    }

    onSkipCreatePass(): void {
        this.ngZone.run(() => {
            this.variablesService.appPass = '';
            this.variablesService.appLogin = true;
            this.router.navigate(['/']);
        });
    }

    resetJwtWalletRpc(callback?: () => void): void {
        this.backend.setupJwtWalletRpc({ secret: '', zanoCompation: false }, callback);
    }

    beforeDropSecureAppData(): void {
        const config: MatDialogConfig<ConfirmModalData> = {
            disableClose: true,
            data: {
                title: 'LOGIN.DIALOGS.CONFIRMATION.RESET.TITLE',
                message: 'LOGIN.DIALOGS.CONFIRMATION.RESET.MESSAGE',
            },
        };
        this.matDialog
            .open(ConfirmModalComponent, config)
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe({
                next: () => {
                    this.dropSecureAppData();
                },
            });
    }

    dropSecureAppData(): void {
        this.resetLoading = true;
        this.resetJwtWalletRpc(() => {
            this.variablesService.wallets.forEach(({ wallet_id }) => {
                this.backend.closeWallet(wallet_id, () => {
                    for (let i = this.variablesService.wallets.length - 1; i >= 0; i--) {
                        this.variablesService.wallets.splice(i, 1);
                        this.backend.storeSecureAppData(() => {
                            if (this.variablesService.wallets.length === 0) {
                                this.backend.dropSecureAppData(() => {
                                    this.ngZone.run(() => {
                                        this.resetLoading = false;
                                        this.onSkipCreatePass();
                                    });
                                });
                            }
                        });
                    }
                });
            });

            if (this.variablesService.wallets.length === 0) {
                this.backend.dropSecureAppData(() => {
                    this.ngZone.run(() => {
                        this.resetLoading = false;
                        this.onSkipCreatePass();
                    });
                });
            }
        });
        this.variablesService.contacts = [];
    }

    onSubmitAuthPass(): void {
        this.submitLoading = true;

        if (this.loginForm.valid) {
            this.variablesService.appPass = this.loginForm.get('password').value;
            if (this.variablesService.dataIsLoaded) {
                this.backend.checkMasterPassword({ pass: this.variablesService.appPass }, (status) => {
                    if (status) {
                        this.variablesService.appLogin = true;
                        if (this.variablesService.settings.appLockTime) {
                            this.variablesService.startCountdown();
                        }
                        this.ngZone.run(() => {
                            this.submitLoading = false;
                            this.router.navigate(['/'], {
                                queryParams: { prevUrl: 'login' },
                            });
                        });
                    } else {
                        this.ngZone.run(() => {
                            this.submitLoading = false;
                            this.setAuthPassError({ wrong_password: true });
                        });
                    }
                });
            } else {
                this.getData(this.variablesService.appPass);
            }
        } else {
            this.submitLoading = false;
            setTimeout(() => {
                this.errorsSection?.nativeElement?.focus();
            }, 150);
        }
    }

    getData(appPass): void {
        this.backend.getSecureAppData({ pass: appPass }, (status, data) => {
            if (!data.error_code) {
                this.setAuthPassError(null);
                this.variablesService.appLogin = true;
                this.variablesService.dataIsLoaded = true;
                if (this.variablesService.settings.appLockTime) {
                    this.variablesService.startCountdown();
                }
                this.variablesService.appPass = appPass;
                const isEmptyObject = Object.keys(data).length === 0 && data.constructor === Object;

                if (this.variablesService.wallets.length > 0) {
                    this.ngZone.run(() => {
                        this.submitLoading = false;
                        this.router.navigate(['/wallet/']);
                    });
                    return;
                }
                if (hasOwnProperty(data, 'contracts')) {
                    if (Object.keys(data['contacts']).length !== 0) {
                        data['contacts'].map((contact) => {
                            this.variablesService.contacts.push(contact);
                        });
                    }
                }
                if (hasOwnProperty(data, 'wallets')) {
                    if (Object.keys(data['wallets']).length !== 0) {
                        this.getWalletData(data['wallets']);
                    } else {
                        this.ngZone.run(() => {
                            this.submitLoading = false;
                            this.router.navigate(['/']);
                        });
                    }
                }
                if (!hasOwnProperty(data, 'wallets') && !hasOwnProperty(data, 'contracts')) {
                    if (data.length !== 0 && !isEmptyObject) {
                        this.getWalletData(data);
                    } else {
                        this.ngZone.run(() => {
                            this.submitLoading = false;
                            this.router.navigate(['/']);
                        });
                    }
                }

                if (this.variablesService.settings.zanoCompanionForm.zanoCompation) {
                    this.backend.setupJwtWalletRpc(this.variablesService.settings.zanoCompanionForm);
                }
            }

            if (data.error_code === 'WRONG_PASSWORD') {
                this.ngZone.run(() => {
                    this.submitLoading = false;
                    this.setAuthPassError({ wrong_password: true });
                });
            }
        });
    }

    getWalletData(walletData): void {
        let openWallets = 0;
        let runWallets = 0;
        walletData.forEach((wallet, wallet_index) => {
            this.backend.openWallet(wallet.path, wallet.pass, this.variablesService.count, true, (open_status, open_data, open_error) => {
                if (open_status || open_error === 'FILE_RESTORED') {
                    openWallets++;
                    this.ngZone.run(() => {
                        const new_wallet = new Wallet(
                            open_data.wallet_id,
                            wallet.name,
                            wallet.pass,
                            open_data['wi'].path,
                            open_data['wi'].address,
                            open_data['wi'].balance,
                            open_data['wi'].unlocked_balance,
                            open_data['wi'].mined_total,
                            open_data['wi'].tracking_hey
                        );
                        if (wallet.staking) {
                            new_wallet.staking = true;
                            this.backend.startPosMining(new_wallet.wallet_id);
                        } else {
                            new_wallet.staking = false;
                        }
                        new_wallet.is_auditable = open_data['wi'].is_auditable;
                        new_wallet.is_watch_only = open_data['wi'].is_watch_only;
                        new_wallet.currentPage = 1;
                        new_wallet.exclude_mining_txs = false;
                        if (open_data.recent_history && open_data.recent_history.history) {
                            new_wallet.total_history_item = open_data.recent_history.total_history_items;
                            new_wallet.totalPages = Math.ceil(open_data.recent_history.total_history_items / this.variablesService.count);
                            new_wallet.totalPages > this.variablesService.maxPages
                                ? (new_wallet.pages = new Array(5).fill(1).map((value, index) => value + index))
                                : (new_wallet.pages = new Array(new_wallet.totalPages).fill(1).map((value, index) => value + index));
                            new_wallet.prepareHistory(open_data.recent_history.history);
                        } else {
                            new_wallet.total_history_item = 0;
                            new_wallet.pages = new Array(1).fill(1);
                            new_wallet.totalPages = 1;
                        }
                        this.walletsService.addWallet(new_wallet);
                        if (this.variablesService.wallets.length === 1) {
                            this.router.navigate(['/wallet/']);
                        }
                    });
                    this.backend.runWallet(open_data.wallet_id, (run_status) => {
                        if (run_status) {
                            runWallets++;
                        } else {
                            if (wallet_index === walletData.length - 1 && runWallets === 0) {
                                this.ngZone.run(() => {
                                    this.router.navigate(['/']);
                                });
                            }
                        }
                    });
                } else {
                    if (wallet_index === walletData.length - 1 && openWallets === 0) {
                        this.ngZone.run(() => {
                            this.router.navigate(['/']);
                        });
                    }
                }
            });
        });
        this.submitLoading = false;
    }

    private setAuthPassError(errors: ValidationErrors | null): void {
        this.loginForm.controls['password'].setErrors(errors);
    }
}
