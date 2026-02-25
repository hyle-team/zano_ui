import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { Router } from '@angular/router';
import { Wallet } from '@api/models/wallet.model';
import { TranslateService } from '@ngx-translate/core';
import { REG_EXP_PASSWORD, ZanoValidators } from '@parts/utils/zano-validators';
import { WalletsService } from '@parts/services/wallets.service';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { MAX_WALLET_NAME_LENGTH } from "@parts/data/constants";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
    selector: 'app-create-wallet',
    templateUrl: './create-wallet.component.html',
})
export class CreateWalletComponent implements OnInit, OnDestroy {
    loading = false;

    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/add-wallet',
            title: 'BREADCRUMBS.ADD_WALLET',
        },
        {
            title: 'BREADCRUMBS.CREATE_WALLET',
        },
    ];

    form = this._fb.group(
        {
            name: ['', [Validators.required, Validators.maxLength(MAX_WALLET_NAME_LENGTH), ZanoValidators.duplicate(this.variablesService.walletNamesForComparisons)]],
            password: ['', Validators.pattern(REG_EXP_PASSWORD)],
            confirm: ['', [
                (control: AbstractControl): ValidationErrors | null => {
                    if (!control.parent) return null;

                    const password = control.parent.get('password')?.value;
                    const confirm = control.value;

                    return password === confirm ? null : { mismatch: true };
                }
            ]],
            path: ['', Validators.required],
        }
    );

    private _destroy$ = new Subject<void>();

    constructor(
        public variablesService: VariablesService,
        public walletsService: WalletsService,
        private _fb: NonNullableFormBuilder,
        private _router: Router,
        private _backendService: BackendService,
        private _modalService: ModalService,
        private _ngZone: NgZone,
        private _translateService: TranslateService
    ) {
    }

    ngOnInit() {
        this.form.controls.password.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
            this.form.controls.confirm.updateValueAndValidity({ onlySelf: true });
        });
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }


    get savedWalletName(): string {
        const path = this.form.controls.path.value;
        return path.substr(path.lastIndexOf('/') + 1, path.length - 1);
    }

    createWallet(): void {
        this.loading = true;

        const { path: selectedPath, password, name } = this.form.getRawValue();

        let walletName = '';
        if (name.lastIndexOf('.') === -1) {
            walletName = name;
        } else {
            walletName = name.slice(0, name.lastIndexOf('.'));
        }
        this._backendService.generateWallet(selectedPath, password, (generate_status, generate_data, errorCode) => {
            if (generate_status) {
                const { wallet_id } = generate_data;
                const { path, address, balance, unlocked_balance, mined_total, tracking_hey } = generate_data['wi'];

                const wallet = new Wallet(
                    wallet_id,
                    walletName,
                    password,
                    path,
                    address,
                    balance,
                    unlocked_balance,
                    mined_total,
                    tracking_hey
                );
                wallet.total_history_item = 0;
                wallet.pages = new Array(1).fill(1);
                wallet.totalPages = 1;
                wallet.currentPage = 1;
                wallet.exclude_mining_txs = false;
                this.walletsService.addWallet(wallet);
                this._backendService.runWallet(wallet_id, (run_status, run_data) => {
                    if (run_status) {
                        this._ngZone.run(() => {
                            if (this.variablesService.appPass) {
                                this._backendService.storeSecureAppData();
                            }
                            this.variablesService.setCurrentWallet(wallet_id);
                            this.loading = false;
                            this._router.navigate(['/seed-phrase'], { queryParams: { wallet_id } });
                        });
                    } else {
                        console.log(run_data['error_code']);
                        this._ngZone.run(() => {
                            this.loading = false;
                        });
                    }
                });
            } else {
                const errorTranslationKey =
                    errorCode === 'ALREADY_EXISTS' ? 'CREATE_WALLET.ERROR_CANNOT_SAVE_TOP' : 'CREATE_WALLET.ERROR_CANNOT_SAVE_SYSTEM';
                this._modalService.prepareModal('error', errorTranslationKey);

                this._ngZone.run(() => {
                    this.loading = false;
                });
            }
        });
    }

    selectLocation(): void {
        const caption = this._translateService.instant('CREATE_WALLET.TITLE_SAVE');
        const fileMask = '*';
        const { default_path } = this.variablesService.settings;
        this._backendService.saveFileDialog(caption, fileMask, default_path, (file_status, file_data) => {
            if (file_status) {
                this._ngZone.run(() => {
                    const { path } = file_data;
                    this.form.controls.path.patchValue(path);
                    this.variablesService.settings.default_path = path.substr(0, path.lastIndexOf('/'));
                });
            }
        });
    }
}
