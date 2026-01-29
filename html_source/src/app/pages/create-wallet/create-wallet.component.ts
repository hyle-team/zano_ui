import { Component, inject, NgZone } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { Router } from '@angular/router';
import { Wallet } from '@api/models/wallet.model';
import { TranslateService } from '@ngx-translate/core';
import { REG_EXP_PASSWORD, ZanoValidators } from '@parts/utils/zano-validators';
import { WalletsService } from '@parts/services/wallets.service';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';

@Component({
    selector: 'app-create-wallet',
    templateUrl: './create-wallet.component.html',
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
export class CreateWalletComponent {
    variablesService = inject(VariablesService);

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

    walletsService = inject(WalletsService);

    fb = inject(NonNullableFormBuilder);

    createForm = this.fb.group(
        {
            name: this.fb.control('', [Validators.required, ZanoValidators.duplicate(this.variablesService.walletNamesForComparisons)]),
            password: this.fb.control('', Validators.pattern(REG_EXP_PASSWORD)),
            confirm: this.fb.control(''),
            path: this.fb.control('', Validators.required),
        },
        {
            validators: [ZanoValidators.formMatch('password', 'confirm')],
        }
    );

    private router = inject(Router);

    private backend = inject(BackendService);

    private modalService = inject(ModalService);

    private ngZone = inject(NgZone);

    private translate = inject(TranslateService);

    get savedWalletName(): string {
        const path = this.createForm.get('path').value;
        return path.substr(path.lastIndexOf('/') + 1, path.length - 1);
    }

    createWallet(): void {
        this.loading = true;

        const { path: selectedPath, password, name } = this.createForm.getRawValue();

        let walletName = '';
        if (name.lastIndexOf('.') === -1) {
            walletName = name;
        } else {
            walletName = name.slice(0, name.lastIndexOf('.'));
        }
        this.backend.generateWallet(selectedPath, password, (generate_status, generate_data, errorCode) => {
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
                this.walletsService.addWallet(wallet);
                this.backend.runWallet(wallet_id, (run_status, run_data) => {
                    if (run_status) {
                        this.ngZone.run(() => {
                            if (this.variablesService.appPass) {
                                this.backend.storeSecureAppData();
                            }
                            this.variablesService.setCurrentWallet(wallet_id);
                            this.loading = false;
                            this.router.navigate(['/seed-phrase'], { queryParams: { wallet_id } });
                        });
                    } else {
                        console.log(run_data['error_code']);
                        this.ngZone.run(() => {
                            this.loading = false;
                        });
                    }
                });
            } else {
                const errorTranslationKey =
                    errorCode === 'ALREADY_EXISTS' ? 'CREATE_WALLET.ERROR_CANNOT_SAVE_TOP' : 'CREATE_WALLET.ERROR_CANNOT_SAVE_SYSTEM';
                this.modalService.prepareModal('error', errorTranslationKey);

                this.ngZone.run(() => {
                    this.loading = false;
                });
            }
        });
    }

    selectWalletLocation(): void {
        const caption = this.translate.instant('CREATE_WALLET.TITLE_SAVE');
        const fileMask = '*';
        const { default_path } = this.variablesService.settings;
        this.backend.saveFileDialog(caption, fileMask, default_path, (file_status, file_data) => {
            if (file_status) {
                this.ngZone.run(() => {
                    const { path } = file_data;
                    this.createForm.get('path').patchValue(path);
                    this.variablesService.settings.default_path = path.substr(0, path.lastIndexOf('/'));
                });
            }
        });
    }
}
