import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { Wallet } from '@api/models/wallet.model';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
import { REG_EXP_PASSWORD, ZanoValidators } from '@parts/utils/zano-validators';
import { WalletsService } from '@parts/services/wallets.service';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { MAX_WALLET_NAME_LENGTH } from '@parts/data/constants';
import { AssetBalances } from '@api/models/assets.model';

interface SeedPhraseInfo {
    address: string;
    hash_sum_matched: boolean;
    require_password: boolean;
    syntax_correct: boolean;
    tracking: boolean;
}

interface RestoreWalletResponse {
    wallet_id: number;
    wi: {
        path: string;
        address: string;
        balance: AssetBalances;
        unlocked_balance: number;
        mined_total: number;
        tracking_hey: string;
        is_auditable: boolean;
        is_watch_only: boolean;
    };
    recent_history?: {
        history: any[];
        total_history_items: number;
    };
}

@Component({
    selector: 'app-restore-wallet',
    templateUrl: './restore-wallet.component.html',
})
export class RestoreWalletComponent implements OnInit, OnDestroy {
    readonly breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/add-wallet',
            title: 'BREADCRUMBS.ADD_WALLET',
        },
        {
            title: 'BREADCRUMBS.RESTORE_WALLET',
        },
    ];

    selectedLocationWalletName: string;

    selectedLocationWalletPath: string;

    seedPhraseInfo: SeedPhraseInfo | null = null;

    readonly walletsService: WalletsService = inject(WalletsService);

    readonly variablesService: VariablesService = inject(VariablesService);

    private readonly _walletNamesForComparisons = this.variablesService.walletNamesForComparisons;

    private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    readonly form = this._fb.group(
        {
            name: ['', [Validators.required, Validators.maxLength(MAX_WALLET_NAME_LENGTH), ZanoValidators.duplicate(this._walletNamesForComparisons)]],
            seedPhrase: ['', Validators.required],
            password: ['', Validators.pattern(REG_EXP_PASSWORD)],
            confirm: [''],
            seedPassword: [''],
        },
        {
            validators: [ZanoValidators.formMatch('password', 'confirm')],
        }
    );

    private _destroy$: Subject<void> = new Subject<void>();

    private readonly _router: Router = inject(Router);

    private readonly _backend: BackendService = inject(BackendService);

    private readonly _modalService: ModalService = inject(ModalService);

    private readonly _ngZone: NgZone = inject(NgZone);

    private readonly _translateService: TranslateService = inject(TranslateService);

    private _submitting = false;

    get isDisabledCreatedWallet(): boolean {
        return this.form.invalid || !this.selectedLocationWalletPath || this._submitting;
    }

    get isDisableSelectLocation(): boolean {
        if (!this.seedPhraseInfo) {
            return true;
        }

        const { syntax_correct, require_password, hash_sum_matched } = this.seedPhraseInfo;
        return (!syntax_correct || !require_password || !hash_sum_matched) && (!syntax_correct || require_password);
    }

    ngOnInit(): void {
        const obs1 = this.form.controls.seedPhrase.valueChanges;
        const obs2 = this.form.controls.seedPassword.valueChanges.pipe(startWith(this.form.controls.seedPassword.getRawValue()));

        combineLatest([obs1, obs2])
            .pipe(debounceTime(250), takeUntil(this._destroy$))
            .subscribe({
                next: ([seed_phrase, seed_password]) => {
                    if (seed_phrase.length === 0) {
                        this.seedPhraseInfo = null;
                        if (seed_password.length > 0) {
                            this.form.controls.seedPassword.reset();
                        }
                        return;
                    }

                    this._backend.getSeedPhraseInfo({ seed_phrase, seed_password }, (status: boolean, data: SeedPhraseInfo) => {
                        this._ngZone.run(() => {
                            if (!status) {
                                this.seedPhraseInfo = null;
                                return;
                            }

                            this.seedPhraseInfo = data;

                            const { syntax_correct, require_password } = data;
                            if (!syntax_correct) {
                                this.form.controls.seedPhrase.setErrors({ syntax_incorrect: true });
                                this.form.controls.seedPassword.reset();
                            }

                            if (require_password) {
                                this._backend.isValidRestoreWalletText({ seed_phrase, seed_password }, (_: boolean, data: string) => {
                                    this._ngZone.run(() => {
                                        if (data === 'FALSE') {
                                            this.form.controls.seedPassword.setErrors({ password_seed_phrase_not_valid: true });
                                        }
                                    });
                                });
                            }
                        });
                    });
                },
            });
    }

    ngOnDestroy(): void {
        this.variablesService.opening_wallet = null;
        this._destroy$.next();
        this._destroy$.complete();
    }

    handlePaste(event: ClipboardEvent): void {
        event.preventDefault();
        const clipboardData = event.clipboardData;
        const pastedData = clipboardData.getData('Text');
        const trimmedData = pastedData.trim();
        this.form.controls.seedPhrase.patchValue(trimmedData);
    }

    restore(): void {
        this._submitting = true;
        const { name, password, seedPhrase, seedPassword } = this.form.getRawValue();
        this._backend.restoreWallet(this.selectedLocationWalletPath, password, seedPhrase, seedPassword, (status: boolean, data: RestoreWalletResponse) => {
            this._ngZone.run(() => {
                if (status) {
                    const { wallet_id } = data;
                    const {
                        path,
                        address,
                        balance,
                        unlocked_balance,
                        mined_total,
                        tracking_hey,
                        is_auditable,
                        is_watch_only
                    } = data.wi;
                    const wallet: Wallet = new Wallet(
                        wallet_id,
                        name,
                        password,
                        path,
                        address,
                        balance,
                        unlocked_balance,
                        mined_total,
                        tracking_hey
                    );
                    wallet.is_auditable = is_auditable;
                    wallet.is_watch_only = is_watch_only;

                    wallet.restore = true;
                    wallet.currentPage = 1;
                    wallet.pages = new Array(1).fill(1);
                    wallet.totalPages = 1;
                    wallet.total_history_item = 0;

                    if (data.recent_history && data.recent_history.history) {
                        wallet.totalPages = Math.ceil(data.recent_history.total_history_items / this.variablesService.count);
                        if (wallet.totalPages > this.variablesService.maxPages) {
                            wallet.pages = new Array(5).fill(1).map((value, index) => value + index);
                        } else {
                            wallet.pages = new Array(wallet.totalPages).fill(1).map((value, index) => value + index);
                        }
                        wallet.prepareHistory(data.recent_history.history);
                    }

                    this.variablesService.opening_wallet = wallet;

                    this._runWallet(wallet);
                } else {
                    this._modalService.prepareModal('error', 'RESTORE_WALLET.NOT_CORRECT_FILE_OR_PASSWORD');
                    this._submitting = false;
                }
            });
        });
    }

    selectLocation(): void {
        const caption = this._translateService.instant('RESTORE_WALLET.CHOOSE_PATH');
        const fileMask = '*';
        const {
            settings: { default_path },
        } = this.variablesService;

        this._backend.saveFileDialog(caption, fileMask, default_path, (status: boolean, data: any) => {
            this._ngZone.run(() => {
                if (status) {
                    const startWalletName = data.path.lastIndexOf('/') + 1;
                    this.selectedLocationWalletName = data.path.substring(startWalletName);
                    this.selectedLocationWalletPath = data.path;

                    this.variablesService.settings.default_path = data.path.substring(0, data.path.lastIndexOf('/'));
                }
            });
        });
    }

    private _runWallet(wallet: Wallet): void {
        const { wallets, appPass } = this.variablesService;
        const { wallet_id, address } = wallet;

        // Add flag when wallet was restored form seed
        this.variablesService.after_sync_request[wallet_id] = true;

        const exists: boolean = wallets.some((w: Wallet): boolean => w.address === address);

        if (exists) {
            this.variablesService.opening_wallet = null;

            this._modalService.prepareModal('error', 'OPEN_WALLET.WITH_ADDRESS_ALREADY_OPEN');

            this._backend.closeWallet(wallet_id, () => {
                this._ngZone.run(() => {
                    this._router.navigate(['/']).then();
                });
            });

            return;
        }

        this.walletsService.addWallet(wallet);

        this._backend.runWallet(wallet_id, (status: boolean, data: any) => {
            this._ngZone.run(() => {
                if (status) {
                    if (appPass) {
                        this._backend.storeSecureAppData();
                    }

                    this.variablesService.setCurrentWallet(wallet_id);
                    this.variablesService.opening_wallet = null;

                    this._router.navigate(['/wallet/']).then();
                } else {
                    this._modalService.prepareModal('error', data['error_code']);
                    this._submitting = false;
                    console.error(data['error_code']);
                }
            });
        });
    }
}
