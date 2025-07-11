import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Wallet } from '@api/models/wallet.model';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ZanoValidators } from '@parts/utils/zano-validators';
import { WalletsService } from '@parts/services/wallets.service';
import { notFileZanoWallet, wrongPassword } from '@parts/utils/zano-errors';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';

@Component({
    selector: 'app-open-wallet',
    templateUrl: './open-wallet.component.html',
})
export class OpenWalletComponent implements OnInit, OnDestroy {
    loading$ = new BehaviorSubject(false);

    fb = inject(NonNullableFormBuilder);

    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/add-wallet',
            title: 'BREADCRUMBS.ADD_WALLET',
        },
        {
            title: 'BREADCRUMBS.OPEN_WALLET',
        },
    ];

    openWalletForm = this.fb.group({
        name: this.fb.control('', [
            Validators.required,
            Validators.maxLength(this.variablesService.maxWalletNameLength),
            ZanoValidators.duplicate(this.variablesService.walletNamesForComparisons),
        ]),
        password: this.fb.control(''),
        filePath: this.fb.control('', Validators.required),
    });

    private destroy$ = new Subject<void>();

    constructor(
        public walletsService: WalletsService,
        public variablesService: VariablesService,
        private route: ActivatedRoute,
        private router: Router,
        private backend: BackendService,
        private modalService: ModalService,
        private ngZone: NgZone,
        private translate: TranslateService
    ) {}

    ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
            next: (params) => {
                if (!params.path) {
                    return;
                }

                this.openWalletForm.controls.filePath.patchValue(params.path);

                let filename = '';
                if (params.path.lastIndexOf('.') === -1) {
                    filename = params.path.substr(params.path.lastIndexOf('/') + 1);
                } else {
                    filename = params.path.substr(
                        params.path.lastIndexOf('/') + 1,
                        params.path.lastIndexOf('.') - 1 - params.path.lastIndexOf('/')
                    );
                }
                if (filename.length > 25) {
                    filename = filename.slice(0, 25);
                }
                this.openWalletForm.controls.name.patchValue(filename);
                this.openWalletForm.controls.name.markAsTouched();
            },
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    openWallet(): void {
        this.loading$.next(true);

        if (this.openWalletForm.valid) {
            const { filePath, password, name } = this.openWalletForm.getRawValue();
            const { count: txs_to_return } = this.variablesService;
            this.backend.openWallet(
                filePath,
                password,
                txs_to_return,
                false,
                (openStatus, openData, errorCode: 'WRONG_PASSWORD' | 'FILE_NOT_FOUND' | 'INVALID_FILE' | 'ALREADY_EXISTS' | string) => {
                    console.log('openData', openData);
                    if (errorCode === 'WRONG_PASSWORD') {
                        this.ngZone.run(() => {
                            this.openWalletForm.controls.password.setErrors({
                                wrongPassword,
                            });
                            this.loading$.next(false);
                        });
                        return;
                    }

                    let errorText = errorCode;

                    if (errorCode === 'FILE_NOT_FOUND') {
                        errorText = this.translate.instant('OPEN_WALLET.FILE_NOT_FOUND1');
                        errorText += ':<br>' + filePath;
                        errorText += this.translate.instant('OPEN_WALLET.FILE_NOT_FOUND2');
                    }

                    if (errorCode === 'INVALID_FILE') {
                        errorText = this.translate.instant(notFileZanoWallet.errorText);
                    }

                    if (['INVALID_FILE', 'FILE_NOT_FOUND'].includes(errorCode)) {
                        this.modalService.prepareModal('error', errorText);
                        this.ngZone.run(() => {
                            this.loading$.next(false);
                        });
                        return;
                    }

                    if (openStatus || errorCode === 'FILE_RESTORED') {
                        let exists = false;
                        this.variablesService.wallets.forEach((wallet) => {
                            if (wallet.address === openData['wi'].address) {
                                exists = true;
                            }
                        });

                        if (exists) {
                            this.modalService.prepareModal('error', 'OPEN_WALLET.WITH_ADDRESS_ALREADY_OPEN');
                            this.backend.closeWallet(openData.wallet_id, () => {
                                this.ngZone.run(() => {
                                    this.loading$.next(false);
                                    this.router.navigate(['/']);
                                });
                            });
                        } else {
                            const new_wallet = new Wallet(
                                openData.wallet_id,
                                name,
                                password,
                                openData['wi'].path,
                                openData['wi'].address,
                                openData['wi'].balance,
                                openData['wi'].unlocked_balance,
                                openData['wi'].mined_total,
                                openData['wi'].tracking_hey
                            );
                            new_wallet.currentPage = 1;
                            new_wallet.open_from_exist = true;
                            new_wallet.exclude_mining_txs = false;
                            new_wallet.is_auditable = openData['wi'].is_auditable;
                            new_wallet.is_watch_only = openData['wi'].is_watch_only;
                            if (openData.recent_history && openData.recent_history.history) {
                                new_wallet.total_history_item = openData.recent_history.total_history_items;
                                new_wallet.totalPages = Math.ceil(
                                    openData.recent_history.total_history_items / this.variablesService.count
                                );
                                new_wallet.totalPages > this.variablesService.maxPages
                                    ? (new_wallet.pages = new Array(5).fill(1).map((value, index) => value + index))
                                    : (new_wallet.pages = new Array(new_wallet.totalPages).fill(1).map((value, index) => value + index));
                                new_wallet.prepareHistory(openData.recent_history.history);
                            } else {
                                new_wallet.total_history_item = 0;
                                new_wallet.pages = new Array(1).fill(1);
                                new_wallet.totalPages = 1;
                            }
                            this.walletsService.addWallet(new_wallet);
                            this.backend.runWallet(openData.wallet_id, (run_status, run_data) => {
                                if (run_status) {
                                    if (this.variablesService.appPass) {
                                        this.backend.storeSecureAppData();
                                    }
                                    this.ngZone.run(() => {
                                        this.variablesService.setCurrentWallet(openData.wallet_id);
                                        this.router.navigate(['/wallet/']);
                                        this.loading$.next(false);
                                    });
                                } else {
                                    console.log(run_data['error_code']);
                                    this.ngZone.run(() => {
                                        this.loading$.next(false);
                                    });
                                }
                            });
                        }
                    }
                }
            );
        } else {
            this.loading$.next(false);
        }
    }
}
