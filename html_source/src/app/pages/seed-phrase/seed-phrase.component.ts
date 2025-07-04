import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { FormBuilder, Validators } from '@angular/forms';
import { hasOwnProperty } from '@parts/functions/has-own-property';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { REG_EXP_PASSWORD, ZanoValidators } from '@parts/utils/zano-validators';
import { WalletsService } from '@parts/services/wallets.service';
import { Wallet } from '@api/models/wallet.model';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';

@Component({
    selector: 'app-seed-phrase',
    templateUrl: './seed-phrase.component.html',
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
export class SeedPhraseComponent implements OnInit, OnDestroy {
    seedPhrase = '';

    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/add-wallet',
            title: 'BREADCRUMBS.ADD_WALLET',
        },
        {
            title: 'BREADCRUMBS.SAVE_PHRASE',
        },
    ];

    showSeed = false;

    wallet_id: number;

    wallet!: Wallet;

    seedPhraseCopied = false;

    progressWidth = '66%';

    fb = inject(FormBuilder);

    detailsForm = this.fb.group({
        name: this.fb.nonNullable.control('', [ZanoValidators.duplicate(this.variablesService.walletNamesForComparisons)]),
        path: this.fb.nonNullable.control(''),
    });

    seedPhraseForm = this.fb.group(
        {
            password: this.fb.nonNullable.control('', Validators.pattern(REG_EXP_PASSWORD)),
            confirmPassword: this.fb.nonNullable.control(''),
        },
        {
            validators: [ZanoValidators.formMatch('password', 'confirmPassword')],
        }
    );

    private destroy$ = new Subject<void>();

    constructor(
        public walletsService: WalletsService,
        public variablesService: VariablesService,
        private route: ActivatedRoute,
        private backend: BackendService,
        private ngZone: NgZone
    ) {}

    ngOnInit(): void {
        this.showSeed = false;
        this.getWallet();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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

    showSeedPhrase(): void {
        this.showSeed = true;
        this.progressWidth = '100%';
    }

    onSubmitSeed(): void {
        if (this.seedPhraseForm.valid) {
            this.showSeedPhrase();
            const wallet_id = this.wallet_id;
            const seed_password = this.seedPhraseForm.controls.password.value;
            this.backend.getSmartWalletInfo({ wallet_id, seed_password }, (status, data) => {
                if (hasOwnProperty(data, 'seed_phrase')) {
                    this.ngZone.run(() => {
                        this.seedPhrase = data['seed_phrase'].trim();
                    });
                }
            });
        }
    }

    private setWalletInfoNamePath(): void {
        this.detailsForm.get('name').setValue(this.wallet.name);
        this.detailsForm.get('path').setValue(this.wallet.path);
    }

    private getWallet(): void {
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe({
            next: (params) => {
                if (params.wallet_id) {
                    this.wallet_id = +params.wallet_id;
                    this.wallet = this.walletsService.getWalletById(this.wallet_id);
                    if (this.wallet) {
                        this.setWalletInfoNamePath();
                    }
                }
            },
        });
    }
}
