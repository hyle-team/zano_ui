import { Component, inject, NgZone } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { Router } from '@angular/router';
import { hasOwnProperty } from '@parts/functions/has-own-property';
import { REG_EXP_PASSWORD, ZanoValidators } from '@parts/utils/zano-validators';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';

@Component({
    selector: 'app-wallet-details',
    templateUrl: './wallet-details.component.html',
})
export class WalletDetailsComponent {
    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/wallet/history',
            title: this.variablesService.current_wallet.name,
        },
        {
            title: 'BREADCRUMBS.WALLET_DETAILS',
        },
    ];

    seedPhrase = '';

    showSeed = false;

    seedPhraseCopied = false;

    ifSaved = false;

    fb = inject(NonNullableFormBuilder);

    detailsForm = this.fb.group({
        name: this.fb.control('', [Validators.required, ZanoValidators.duplicate(this.variablesService.walletNamesForComparisons)]),
        path: this.fb.control(''),
    });

    passwordSeedPhraseForm = this.fb.group(
        {
            password: this.fb.control('', Validators.pattern(REG_EXP_PASSWORD)),
            confirmPassword: this.fb.control(''),
        },
        {
            validators: [ZanoValidators.formMatch('password', 'confirmPassword')],
        }
    );

    constructor(
        public variablesService: VariablesService,
        private router: Router,
        private backend: BackendService,
        private ngZone: NgZone
    ) {
        const { current_wallet } = this.variablesService;
        const { name, path } = current_wallet;
        this.detailsForm.patchValue(
            {
                name,
                path,
            },
            {
                emitEvent: false,
            }
        );
    }

    beforeSubmitPasswordSeedPhrase(): void {
        if (this.passwordSeedPhraseForm.invalid) {
            this.passwordSeedPhraseForm.updateValueAndValidity();
            this.passwordSeedPhraseForm.markAllAsTouched();
            return;
        }

        this.submitPasswordSeedPhrase();
    }

    submitPasswordSeedPhrase(): void {
        const { wallet_id } = this.variablesService.current_wallet;
        const { password: seed_password } = this.passwordSeedPhraseForm.getRawValue();
        this.backend.getSmartWalletInfo({ wallet_id, seed_password }, (status, data) => {
            if (hasOwnProperty(data, 'seed_phrase')) {
                this.ngZone.run(() => {
                    this.showSeed = true;
                    this.seedPhrase = data['seed_phrase'].trim();
                });
            }
        });
    }

    beforeSubmitDetails(): void {
        if (this.detailsForm.invalid) {
            this.detailsForm.updateValueAndValidity();
            this.detailsForm.markAllAsTouched();
            return;
        }

        this.submitDetails();
    }

    submitDetails(): void {
        const getRawValue = this.detailsForm.getRawValue();
        const { name } = getRawValue;
        this.variablesService.current_wallet.name = name;
        this.detailsForm.reset(getRawValue);
        this.refreshDetailsFormValidators();
        this.ifSaved = true;
        setTimeout(() => {
            this.ifSaved = false;
        }, 3000);
    }

    copySeedPhrase(): void {
        this.backend.setClipboard(this.seedPhrase, () => {
            this.ngZone.run(() => {
                setTimeout(() => {
                    this.seedPhraseCopied = false;
                }, 4000);
                this.seedPhraseCopied = true;
            });
        });
    }

    private refreshDetailsFormValidators(): void {
        const walletNamesForComparisons = this.variablesService.walletNamesForComparisons;
        const validatorsForName = [Validators.required, ZanoValidators.duplicate(walletNamesForComparisons)];
        this.detailsForm.controls.name.clearValidators();
        this.detailsForm.controls.name.setValidators(validatorsForName);
        this.detailsForm.controls.name.updateValueAndValidity();
    }
}
