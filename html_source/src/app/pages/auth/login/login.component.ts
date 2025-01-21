import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { Wallet } from '@api/models/wallet.model';
import { hasOwnProperty } from '@parts/functions/has-own-property';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { regExpPassword, ZanoValidators } from '@parts/utils/zano-validators';
import { WalletsService } from '@parts/services/wallets.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    submitLoading$ = new BehaviorSubject(false);

    resetLoading$ = new BehaviorSubject(false);

    fb = inject(FormBuilder);

    get zanoLogo(): string {
        const {
            settings: { isDarkTheme },
        } = this.variablesService;
        return isDarkTheme ? 'assets/icons/blue/zano-logo.svg' : 'assets/icons/blue/light-zano-logo.svg';
    }

    regForm = this.fb.group(
        {
            password: this.fb.nonNullable.control('', Validators.pattern(regExpPassword)),
            confirmation: this.fb.nonNullable.control(''),
        },
        {
            validators: [ZanoValidators.formMatch('password', 'confirmation')],
        }
    );

    authForm = this.fb.group({
        password: this.fb.nonNullable.control(''),
    });

    type = 'reg';

    private destroy$ = new Subject<void>();

    constructor(
        public variablesService: VariablesService,
        public walletsService: WalletsService,
        private route: ActivatedRoute,
        private router: Router,
        private backend: BackendService,
        private ngZone: NgZone
    ) {}

    ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
            next: params => {
                if (params.type) {
                    this.type = params.type;
                }
            },
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSubmitCreatePass(): void {
        if (this.regForm.valid) {
            this.variablesService.appPass = this.regForm.get('password').value; // the pass what was written in input of login form by user

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

    dropSecureAppData(): void {
        this.resetLoading$.next(true);

        this.resetJwtWalletRpc(() => {
            this.variablesService.wallets.forEach(({ wallet_id }) => {
                this.backend.closeWallet(wallet_id, () => {
                    for (let i = this.variablesService.wallets.length - 1; i >= 0; i--) {
                        this.variablesService.wallets.splice(i, 1);
                        this.backend.storeSecureAppData(() => {
                            if (this.variablesService.wallets.length === 0) {
                                this.backend.dropSecureAppData(() => {
                                    this.ngZone.run(() => {
                                        this.resetLoading$.next(false);
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
                        this.resetLoading$.next(false);
                        this.onSkipCreatePass();
                    });
                });
            }
        });
        this.variablesService.contacts = [];
    }

    onSubmitAuthPass(): void {
        this.submitLoading$.next(true);

        if (this.authForm.valid) {
            this.variablesService.appPass = this.authForm.get('password').value;
            if (this.variablesService.dataIsLoaded) {
                this.backend.checkMasterPassword({ pass: this.variablesService.appPass }, status => {
                    if (status) {
                        this.variablesService.appLogin = true;
                        if (this.variablesService.settings.appLockTime) {
                            this.variablesService.startCountdown();
                        }
                        this.ngZone.run(() => {
                            this.submitLoading$.next(false);
                            this.router.navigate(['/'], {
                                queryParams: { prevUrl: 'login' },
                            });
                        });
                    } else {
                        this.ngZone.run(() => {
                            this.submitLoading$.next(false);
                            this.setAuthPassError({ wrong_password: true });
                        });
                    }
                });
            } else {
                this.getData(this.variablesService.appPass);
            }
        } else {
            this.submitLoading$.next(false);
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
                        this.submitLoading$.next(false);
                        this.router.navigate(['/wallet/']);
                    });
                    return;
                }
                if (hasOwnProperty(data, 'contracts')) {
                    if (Object.keys(data['contacts']).length !== 0) {
                        data['contacts'].map(contact => {
                            this.variablesService.contacts.push(contact);
                        });
                    }
                }
                if (hasOwnProperty(data, 'wallets')) {
                    if (Object.keys(data['wallets']).length !== 0) {
                        this.getWalletData(data['wallets']);
                    } else {
                        this.ngZone.run(() => {
                            this.submitLoading$.next(false);
                            this.router.navigate(['/']);
                        });
                    }
                }
                if (!hasOwnProperty(data, 'wallets') && !hasOwnProperty(data, 'contracts')) {
                    if (data.length !== 0 && !isEmptyObject) {
                        this.getWalletData(data);
                    } else {
                        this.ngZone.run(() => {
                            this.submitLoading$.next(false);
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
                    this.submitLoading$.next(false);
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
                        new_wallet.alias = this.backend.getWalletAlias(new_wallet.address);
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
                    this.backend.runWallet(open_data.wallet_id, run_status => {
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
        this.submitLoading$.next(false);
    }

    closeAllWallets(): void {
        this.variablesService.wallets.forEach(({ wallet_id }) => this.closeWallet(wallet_id));
    }

    closeWallet(wallet_id) {
        this.backend.closeWallet(wallet_id, () => {
            for (let i = this.variablesService.wallets.length - 1; i >= 0; i--) {
                this.variablesService.wallets.splice(i, 1);
                this.backend.storeSecureAppData();
            }
        });
    }

    private setAuthPassError(errors: ValidationErrors | null): void {
        this.authForm.controls['password'].setErrors(errors);
    }
}
