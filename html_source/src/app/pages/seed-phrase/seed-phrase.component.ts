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
    template: `
        <div class="page-container">
            <div class="toolbar mb-2">
                <div class="left">
                    <app-back-button></app-back-button>
                    <h1 class="ml-2">{{ 'BREADCRUMBS.ADD_WALLET' | translate }}</h1>
                </div>
                <div class="right"></div>
            </div>

            <div class="page-content">
                <app-breadcrumbs class="mb-2" [items]="breadcrumbItems"></app-breadcrumbs>

                <div class="scrolled-content">
                    <div class="wrap-seed-phrase" fxFlex="100" fxLayout="column">
                        <form [formGroup]="detailsForm" class="form">
                            <div class="form__field">
                                <label>{{ 'WALLET_DETAILS.LABEL_NAME' | translate }}</label>
                                <input
                                    (contextmenu)="variablesService.onContextMenu($event)"
                                    [maxLength]="variablesService.maxWalletNameLength"
                                    [placeholder]="'PLACEHOLDERS.WALLET_NAME_PLACEHOLDER' | translate"
                                    class="form__field--input"
                                    formControlName="name"
                                    id="wallet-name"
                                    readonly
                                    type="text"
                                />
                                <div
                                    *ngIf="
                                        detailsForm.controls['name'].invalid &&
                                        (detailsForm.controls['name'].dirty || detailsForm.controls['name'].touched)
                                    "
                                    class="error"
                                >
                                    <div *ngIf="detailsForm.controls['name'].errors['duplicate']">
                                        {{ 'WALLET_DETAILS.FORM_ERRORS.NAME_DUPLICATE' | translate }}
                                    </div>
                                    <div *ngIf="detailsForm.get('name').value.length >= variablesService.maxWalletNameLength">
                                        {{ 'WALLET_DETAILS.FORM_ERRORS.MAX_LENGTH' | translate }}
                                    </div>
                                    <div *ngIf="detailsForm.controls['name'].errors['required']">
                                        {{ 'WALLET_DETAILS.FORM_ERRORS.NAME_REQUIRED' | translate }}
                                    </div>
                                </div>
                            </div>

                            <div class="form__field">
                                <label for="wallet-location">{{ 'WALLET_DETAILS.LABEL_FILE_LOCATION' | translate }}</label>
                                <input class="form__field--input" formControlName="path" id="wallet-location" readonly type="text" />
                            </div>
                        </form>

                        <ng-container *ngIf="!showSeed; else seedPhraseContent">
                            <form (ngSubmit)="onSubmitSeed()" [formGroup]="seedPhraseForm" class="form form__card pb-2">
                                <div class="form__field">
                                    <label for="create-password">{{ 'WALLET_DETAILS.CREATE_PASSWORD_SECURE' | translate }}</label>
                                    <input
                                        class="form__field--input"
                                        formControlName="password"
                                        id="create-password"
                                        placeholder="{{ 'PLACEHOLDERS.PASSWORD_PLACEHOLDER' | translate }}"
                                        type="password"
                                    />
                                    <div
                                        *ngIf="
                                            seedPhraseForm.controls.password.invalid &&
                                            (seedPhraseForm.controls['password'].dirty || seedPhraseForm.controls['password'].touched)
                                        "
                                        class="error"
                                    >
                                        <ng-container *ngIf="seedPhraseForm.controls['password'].hasError('pattern')">
                                            {{ 'ERRORS.REGEXP_INVALID_PASSWORD' | translate }}
                                        </ng-container>
                                    </div>
                                </div>

                                <div class="form__field">
                                    <label for="confirm-password">{{ 'WALLET_DETAILS.FORM.CONFIRM_PASSWORD' | translate }}</label>
                                    <input
                                        [class.invalid]="seedPhraseForm.invalid && seedPhraseForm.get('confirmPassword').value.length > 0"
                                        class="form__field--input"
                                        formControlName="confirmPassword"
                                        id="confirm-password"
                                        placeholder="{{ 'PLACEHOLDERS.PLACEHOLDER_CONFIRM' | translate }}"
                                        type="password"
                                    />
                                    <div
                                        *ngIf="
                                            seedPhraseForm.invalid &&
                                            (seedPhraseForm.controls['confirmPassword'].dirty ||
                                                seedPhraseForm.controls['confirmPassword'].touched)
                                        "
                                        class="error"
                                    >
                                        <div *ngIf="seedPhraseForm.invalid && seedPhraseForm.get('confirmPassword').value.length > 0">
                                            {{ 'WALLET_DETAILS.FORM_ERRORS.PASSWORDS_DONT_MATCH' | translate }}
                                        </div>
                                    </div>
                                </div>

                                <button [disabled]="!seedPhraseForm.valid" class="primary w-100 big mb-2" type="submit">
                                    <mat-icon svgIcon="zano-check-shield" class="mr-1"></mat-icon>
                                    {{ 'WALLET_DETAILS.FORM.GENERATE_SECURE_SEED' | translate }}
                                </button>

                                <p class="text-align-center color-primary">
                                    <mat-icon svgIcon="zano-info" class="mr-1"></mat-icon>
                                    {{ 'WALLET_DETAILS.FORM.SECURED_SEED_WILL_REQUIRE' | translate }}
                                </p>
                            </form>
                        </ng-container>

                        <ng-template #seedPhraseContent>
                            <div class="seed-phrase form__card pb-2">
                                <div class="header mb-2" fxLayout="row" fxLayoutAlign="space-between center">
                                    <div class="left">
                                        <span>{{ 'WALLET_DETAILS.LABEL_SEED_PHRASE' | translate }}</span>
                                    </div>
                                    <div class="right">
                                        <span
                                            *ngIf="seedPhraseForm.controls.password.value.length === 0"
                                            class="status color-red"
                                            fxLayout="row"
                                            fxLayoutAlign="start center"
                                        >
                                            {{ 'WALLET_DETAILS.SEED_IS_UNSECURED' | translate }}
                                            <mat-icon svgIcon="zano-unsecured" class="ml-1"></mat-icon>
                                        </span>
                                        <span
                                            *ngIf="seedPhraseForm.controls.password.value.length > 0"
                                            class="status color-aqua"
                                            fxLayout="row"
                                            fxLayoutAlign="start center"
                                        >
                                            {{ 'WALLET_DETAILS.SEED_IS_SECURED' | translate }}
                                            <mat-icon svgIcon="zano-secured" class="ml-1"></mat-icon>
                                        </span>
                                    </div>
                                </div>
                                <div
                                    (contextmenu)="variablesService.onContextMenuOnlyCopy($event, seedPhrase)"
                                    class="content mb-1"
                                    fxLayout="row wrap"
                                >
                                    <ng-container *ngFor="let word of seedPhrase.split(' '); let index = index">
                                        <div
                                            class="item p-1 mr-1 mb-1 border-radius-0_8-rem"
                                            fxLayout="row nowrap"
                                            fxLayoutAlign="start center"
                                        >
                                            <div class="number p-1 mr-1" fxLayout="row" fxLayoutAlign="center center">
                                                {{ index + 1 }}
                                            </div>
                                            <span class="word">{{ word }}</span>
                                        </div>
                                    </ng-container>
                                </div>
                                <div class="footer max-w-50-rem w-100" fxLayout="column" fxLayoutAlign="start center">
                                    <div *ngIf="showSeed" class="wrap-buttons w-100 mb-2" fxLayout="row nowrap">
                                        <button (click)="copySeedPhrase()" class="outline big w-100" type="button">
                                            <ng-container *ngIf="!seedPhraseCopied">
                                                <mat-icon svgIcon="zano-copy" class="mr-1"></mat-icon>
                                                {{ 'SEED_PHRASE.BUTTON_COPY' | translate }}
                                            </ng-container>
                                            <ng-container *ngIf="seedPhraseCopied">
                                                <mat-icon svgIcon="zano-check" class="mr-1"></mat-icon>
                                                {{ 'SEED_PHRASE.BUTTON_COPIED' | translate }}
                                            </ng-container>
                                        </button>
                                    </div>
                                    <p *ngIf="seedPhraseForm.controls.password.value.length > 0" class="text-align-center">
                                        <mat-icon svgIcon="zano-info" class="mr-1"></mat-icon>
                                        <span class="color-primary">{{ 'WALLET_DETAILS.REMEMBER_YOU_WILL_REQUIRE' | translate }}</span>
                                    </p>
                                </div>
                            </div>
                        </ng-template>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        `
    ]
})
export class SeedPhraseComponent implements OnInit, OnDestroy {
    seedPhrase = '';

    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/add-wallet',
            title: 'BREADCRUMBS.ADD_WALLET'
        },
        {
            title: 'BREADCRUMBS.SAVE_PHRASE'
        }
    ];

    showSeed = false;

    wallet_id: number;

    wallet!: Wallet;

    seedPhraseCopied = false;

    progressWidth = '66%';

    fb = inject(FormBuilder);

    detailsForm = this.fb.group({
        name: this.fb.nonNullable.control('', [ZanoValidators.duplicate(this.variablesService.walletNamesForComparisons)]),
        path: this.fb.nonNullable.control('')
    });

    seedPhraseForm = this.fb.group(
        {
            password: this.fb.nonNullable.control('', Validators.pattern(REG_EXP_PASSWORD)),
            confirmPassword: this.fb.nonNullable.control('')
        },
        {
            validators: [ZanoValidators.formMatch('password', 'confirmPassword')]
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
            next: params => {
                if (params.wallet_id) {
                    this.wallet_id = +params.wallet_id;
                    this.wallet = this.walletsService.getWalletById(this.wallet_id);
                    if (this.wallet) {
                        this.setWalletInfoNamePath();
                    }
                }
            }
        });
    }
}
