import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { AbstractControl, FormControl, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
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
})
export class SeedPhraseComponent implements OnInit, OnDestroy {
    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/add-wallet',
            title: 'BREADCRUMBS.ADD_WALLET',
        },
        {
            title: 'BREADCRUMBS.SAVE_PHRASE',
        },
    ];

    seedPhraseWords: string[] = [];

    showSeed: boolean = false;

    wallet_id: number;

    wallet!: Wallet;

    seedPhraseCopied: boolean = false;

    detailsForm = this._fb.group({
        name: '',
        path: '',
    });

    seedPhraseForm = this._fb.group(
        {
            password: ['', Validators.pattern(REG_EXP_PASSWORD)],
            confirmPassword: ['', [
                (control: AbstractControl): ValidationErrors | null => {
                    if (!control.parent) return null;

                    const password = control.parent.get('password')?.value;
                    const confirm = control.value;

                    return password === confirm ? null : { mismatch: true };
                }
            ]],
        }
    );

    private _destroy$: Subject<void> = new Subject<void>();

    constructor(
        public variablesService: VariablesService,
        private _fb: NonNullableFormBuilder,
        private _walletsService: WalletsService,
        private _route: ActivatedRoute,
        private _backendService: BackendService,
        private _ngZone: NgZone
    ) {}

    ngOnInit(): void {
        this._route.queryParams.pipe(takeUntil(this._destroy$)).subscribe({
            next: (params) => {
                if (params.wallet_id) {
                    this.wallet_id = +params.wallet_id;
                    this.wallet = this._walletsService.getWalletById(this.wallet_id);

                    if (this.wallet) {
                        const { name, path } = this.wallet;
                        this.detailsForm.patchValue({ name, path }, { emitEvent: false });
                    }
                }
            },
        });

        this.seedPhraseForm.controls.password.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
            this.seedPhraseForm.controls.confirmPassword.updateValueAndValidity({ onlySelf: true });
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    copySeedPhrase(): void {
        this._backendService.setClipboard(this.seedPhraseWords.join(' '), () => {
            this._ngZone.run(() => {
                this.seedPhraseCopied = true;
                setTimeout(() => {
                    this.seedPhraseCopied = false;
                }, 4000);
            });
        });
    }

    submit(): void {
        this.showSeed = true;

        const wallet_id = this.wallet_id;
        const { password: seed_password } = this.seedPhraseForm.getRawValue();

        this._backendService.getSmartWalletInfo({ wallet_id, seed_password }, (_, data) => {
            if (hasOwnProperty(data, 'seed_phrase')) {
                this._ngZone.run(() => {
                    const seed = data['seed_phrase'].trim();
                    this.seedPhraseWords = seed ? seed.split(' ') : [];
                });
            }
        });
    }
}
