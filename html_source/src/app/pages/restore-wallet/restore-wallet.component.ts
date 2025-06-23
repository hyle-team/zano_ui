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

interface SeedPhraseInfo {
    address: string;
    hash_sum_matched: boolean;
    require_password: boolean;
    syntax_correct: boolean;
    tracking: boolean;
}

@Component({
    selector: 'app-restore-wallet',
    templateUrl: './restore-wallet.component.html',
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        `,
    ],
})
export class RestoreWalletComponent implements OnInit, OnDestroy {
    public readonly breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/add-wallet',
            title: 'BREADCRUMBS.ADD_WALLET',
        },
        {
            title: 'BREADCRUMBS.RESTORE_WALLET',
        },
    ];

    public selectedLocationWalletName: string;

    public selectedLocationWalletPath: string;

    public seedPhraseInfo: SeedPhraseInfo = null;

    public readonly walletsService: WalletsService = inject(WalletsService);

    public readonly variablesService: VariablesService = inject(VariablesService);

    private readonly _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

    public readonly form = this._fb.group(
        {
            name: this._fb.control('', [
                Validators.required,
                Validators.maxLength(this.variablesService.maxWalletNameLength),
                ZanoValidators.duplicate(this.variablesService.walletNamesForComparisons),
            ]),
            seedPhrase: this._fb.control('', Validators.required),
            password: this._fb.control('', Validators.pattern(REG_EXP_PASSWORD)),
            confirm: this._fb.control(''),
            seedPassword: this._fb.control(''),
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

    private readonly _translate: TranslateService = inject(TranslateService);

    private submitting = false;

    get isDisabledCreatedWallet(): boolean {
        return this.form.invalid || !this.selectedLocationWalletPath || this.submitting;
    }

    get invalidSeedPhraseInfo(): boolean {
        if (!this.seedPhraseInfo) {
            return true;
        }

        const { syntax_correct, require_password, hash_sum_matched } = this.seedPhraseInfo;
        return (!syntax_correct || !require_password || !hash_sum_matched) && (!syntax_correct || require_password);
    }

    ngOnInit(): void {
        const {
            controls: { seedPassword, seedPhrase },
        } = this.form;

        const obs1 = seedPhrase.valueChanges;
        const obs2 = seedPassword.valueChanges.pipe(startWith(seedPassword.value));

        combineLatest([obs1, obs2])
            .pipe(debounceTime(500), takeUntil(this._destroy$))
            .subscribe({
                next: ([seed_phrase, seed_password]) => {
                    const params = { seed_phrase, seed_password };

                    this._backend.getSeedPhraseInfo(params, (status, data) => {
                        this._ngZone.run(() => {
                            if (!status) {
                                this.seedPhraseInfo = undefined;
                                return;
                            }

                            this.seedPhraseInfo = data;
                        });
                    });

                    this._backend.isValidRestoreWalletText(params, (_, data) => {
                        this._ngZone.run(() => {
                            const control = this.form.get('seedPhrase');
                            if (data !== 'TRUE') {
                                control.setErrors({ password_seed_phrase_not_valid: true });
                            } else {
                                control.updateValueAndValidity({ emitEvent: false });
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

    restore(): void {
        this.submitting = true;
        const { name, password, seedPhrase, seedPassword } = this.form.getRawValue();
        this._backend.restoreWallet(this.selectedLocationWalletPath, password, seedPhrase, seedPassword, (status, data) => {
            this._ngZone.run(() => {
                if (status) {
                    const { wallet_id } = data;
                    const { path, address, balance, unlocked_balance, mined_total, tracking_hey, is_auditable, is_watch_only } = data['wi'];
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
                        wallet.totalPages > this.variablesService.maxPages
                            ? (wallet.pages = new Array(5).fill(1).map((value, index) => value + index))
                            : (wallet.pages = new Array(wallet.totalPages).fill(1).map((value, index) => value + index));
                        wallet.prepareHistory(data.recent_history.history);
                    }

                    this.variablesService.opening_wallet = wallet;

                    this._runWallet();
                } else {
                    this._modalService.prepareModal('error', 'RESTORE_WALLET.NOT_CORRECT_FILE_OR_PASSWORD');
                    this.submitting = false;
                }
            });
        });
    }

    selectLocation(): void {
        const caption = this._translate.instant('RESTORE_WALLET.CHOOSE_PATH');
        const fileMask = '*';
        const {
            settings: { default_path },
        } = this.variablesService;

        this._backend.saveFileDialog(caption, fileMask, default_path, (status, data) => {
            this._ngZone.run(() => {
                if (status) {
                    const startWalletName = data.path.lastIndexOf('/') + 1;
                    const endWalletName = data.path.length - 1;
                    this.selectedLocationWalletName = data.path.substr(startWalletName, endWalletName);
                    this.selectedLocationWalletPath = data.path;

                    this.variablesService.settings.default_path = data.path.substr(0, data.path.lastIndexOf('/'));
                }
            });
        });
    }

    private _runWallet(): void {
        const { opening_wallet, wallets, appPass } = this.variablesService;
        const { wallet_id, address } = opening_wallet;

        // Add flag when wallet was restored form seed
        this.variablesService.after_sync_request[wallet_id] = true;

        const exists: boolean = wallets.some((wallet: Wallet): boolean => wallet.address === address);

        if (exists) {
            this.variablesService.opening_wallet = null;

            this._modalService.prepareModal('error', 'OPEN_WALLET.WITH_ADDRESS_ALREADY_OPEN');

            this._backend.closeWallet(wallet_id, () => {
                this._ngZone.run(() => {
                    this._router.navigate(['/']);
                });
            });

            return;
        }

        this.walletsService.addWallet(opening_wallet);

        this._backend.runWallet(wallet_id, (status, data) => {
            this._ngZone.run(() => {
                if (status) {
                    if (appPass) {
                        this._backend.storeSecureAppData();
                    }

                    this.variablesService.setCurrentWallet(wallet_id);
                    this.variablesService.opening_wallet = null;

                    this._router.navigate(['/wallet/']);
                } else {
                    this._modalService.prepareModal('error', data['error_code']);
                    this.submitting = false;
                    console.error(data['error_code']);
                }
            });
        });
    }
}
