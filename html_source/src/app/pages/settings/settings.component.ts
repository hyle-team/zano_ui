import { Component, inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { scaleItems } from '@parts/data/scale-items';
import { regExpPassword, ZanoValidators } from '@parts/utils/zano-validators';
import { generateSecret } from '@parts/utils/generate-secret';

@Component({
    selector: 'app-settings',
    template: `
        <div class="page-container">
            <div class="toolbar mb-2">
                <div class="left">
                    <app-back-button></app-back-button>
                    <h1 class="ml-2">{{ 'SETTINGS.TITLE' | translate }}</h1>
                </div>
                <div class="right"></div>
            </div>

            <div class="page-content">
                <div class="scrolled-content">
                    <div class="settings" fxFlex="0 1 50rem" fxFlexFill fxLayout="column" fxLayoutAlign="start stretch"
                         fxLayoutGap="2rem">
                        <div class="form__field">
                            <label>{{ 'SETTINGS.LANGUAGE.TITLE' | translate }}</label>
                            <ng-select
                                (change)="onLanguageChange()"
                                [(ngModel)]="variablesService.settings.language"
                                [clearable]="false"
                                [items]="languagesOptions"
                                [searchable]="false"
                                bindLabel="language"
                                bindValue="name"
                                class="with-circle"
                            >
                                <ng-template let-item="item" ng-label-tmp>
                                    {{ item.language | translate }}
                                </ng-template>
                                <ng-template let-index="index" let-item="item" ng-option-tmp>
                                    {{ item.language | translate }}
                                </ng-template>
                            </ng-select>
                        </div>

                        <div class="form__field">
                            <label>{{ 'SETTINGS.APP_LOCK.TITLE' | translate }}</label>
                            <ng-select
                                (change)="onLockChange()"
                                [(ngModel)]="variablesService.settings.appLockTime"
                                [clearable]="false"
                                [items]="appLockOptions"
                                [searchable]="false"
                                bindLabel="translationKey"
                                bindValue="time"
                                class="with-circle"
                            >
                                <ng-template let-item="item" ng-label-tmp>
                                    {{ item.translationKey | translate }}
                                </ng-template>
                                <ng-template let-index="index" let-item="item" ng-option-tmp>
                                    {{ item.translationKey | translate }}
                                </ng-template>
                            </ng-select>
                        </div>

                        <div class="form__field">
                            <label>{{ 'SETTINGS.SCALE.TITLE' | translate }}</label>
                            <ng-select
                                (change)="setScale()"
                                [(ngModel)]="variablesService.settings.scale"
                                [clearable]="false"
                                [items]="appScaleOptions"
                                [searchable]="false"
                                bindLabel="name"
                                bindValue="value"
                                class="with-circle"
                            >
                                <ng-template let-item="item" ng-label-tmp>
                                    {{ item.name | translate }}
                                </ng-template>
                                <ng-template let-index="index" let-item="item" ng-option-tmp>
                                    {{ item.name | translate }}
                                </ng-template>
                            </ng-select>
                        </div>

                        <div class="form__field">
                            <label>{{ 'SETTINGS.APP_LOG_TITLE' | translate }}</label>
                            <ng-select
                                (change)="onLogChange()"
                                [(ngModel)]="variablesService.settings.appLog"
                                [clearable]="false"
                                [items]="appLogOptions"
                                [searchable]="false"
                                bindLabel="id"
                                bindValue="id"
                                class="with-circle"
                            >
                            </ng-select>
                        </div>

                        <div class="form__field">
                            <label>{{ 'SETTINGS.NOTIFICATIONS' | translate }}</label>
                            <app-switch (emitChange)="toggleNotifications()"
                                        [value]="currentNotificationsState"></app-switch>
                        </div>

                        <div class="form__field">
                            <label>{{ 'SETTINGS.USE_TOR_TO_RELAY_TRANSACTIONS' | translate }} (Temporarily
                                                                                              disabled)</label>
                            <app-switch (emitChange)="toggleUseTor()" [disabled]="true"
                                        [value]="false && appUseTor"></app-switch>
                        </div>

                        <form *ngIf="variablesService.hasAppPass" class="form" [formGroup]="zanoCompanionForm">
                            <div class="form__field">
                                <label>{{ 'Zano Companion' | translate }}</label>
                                <app-switch></app-switch>
                            </div>

                            <div class="form__zano-companion--container">
                                <div class="form__field form__field--secret">
                                    <label for="field-secret">{{ 'Secret' | translate }}</label>
                                    <input
                                        (contextmenu)="variablesService.onContextMenuOnlyCopy($event, zanoCompanionForm.controls['secret'].value)"
                                        [class.invalid]="zanoCompanionForm.controls['secret'].invalid"
                                        [readonly]="true"
                                        formControlName="secret"
                                        class="form__field--input"
                                        id="field-secret"
                                        type="text"
                                    />
                                    <button class="btn--regenerate" (click)="regenerateSecret()"><i class="icon regenerate"></i></button>
                                </div>

                                <div class="form__field">
                                    <label for="field-port">{{ 'Port' | translate }}</label>
                                    <input
                                        (contextmenu)="variablesService.onContextMenuOnlyCopy($event, zanoCompanionForm.controls['port'].value)"
                                        [class.invalid]="zanoCompanionForm.controls['port'].invalid"
                                        [readonly]="true"
                                        formControlName="port"
                                        class="form__field--input"
                                        id="field-port"
                                        type="text"
                                    />
                                </div>
                            </div>
                        </form>

                        <form (ngSubmit)="onSubmitChangePass()" [formGroup]="changeForm" class="form">
                            <h4 class="master-password-title mb-2">
                                {{ 'SETTINGS.MASTER_PASSWORD.TITLE' | translate }}
                            </h4>

                            <div *ngIf="variablesService.appPass" class="form__field">
                                <label for="old-password">{{ 'SETTINGS.MASTER_PASSWORD.OLD' | translate }}</label>
                                <input
                                    (contextmenu)="variablesService.onContextMenuPasteSelect($event)"
                                    [class.invalid]="
                                    changeForm.invalid &&
                                    changeForm.controls['password'].valid &&
                                    (changeForm.controls['password'].dirty || changeForm.controls['password'].touched) &&
                                    changeForm.errors &&
                                    changeForm.errors['pass_mismatch'] &&
                                    changeForm.get('password').value.length > 0
                                "
                                    class="form__field--input"
                                    formControlName="password"
                                    id="old-password"
                                    placeholder="{{ 'PLACEHOLDERS.PLACEHOLDER_OLD' | translate }}"
                                    type="password"
                                />
                                <div
                                    *ngIf="
                                    changeForm.invalid &&
                                    changeForm.controls['password'].valid &&
                                    (changeForm.controls['password'].dirty || changeForm.controls['password'].touched) &&
                                    changeForm.errors &&
                                    changeForm.errors['pass_mismatch'] &&
                                    changeForm.get('password').value.length > 0
                                "
                                    class="error"
                                >
                                    {{ 'SETTINGS.FORM_ERRORS.CURRENT_PASS_NOT_MATCH' | translate }}
                                </div>
                            </div>

                            <div class="form__field">
                                <label for="new-password">{{ 'SETTINGS.MASTER_PASSWORD.NEW' | translate }}</label>
                                <input
                                    (contextmenu)="variablesService.onContextMenuPasteSelect($event)"
                                    [class.invalid]="changeForm.controls['new_password'].touched && changeForm.controls['new_password'].invalid"
                                    class="form__field--input"
                                    formControlName="new_password"
                                    id="new-password"
                                    placeholder="{{ 'PLACEHOLDERS.PLACEHOLDER_NEW' | translate }}"
                                    type="password"
                                />
                                <div
                                    *ngIf="changeForm.controls['new_password'].touched && changeForm.controls['new_password'].invalid"
                                    class="error"
                                >
                                    <div *ngIf="changeForm.controls['new_password'].errors?.pattern">
                                        {{ 'ERRORS.WRONG_PASSWORD_MUST_BE' | translate }} a-zA-Z0-9_.*|~!?@#$%^&+&#123;}()<>:;"'-=,/[]*$
                                    </div>
                                    <div *ngIf="changeForm.controls['new_password'].hasError('required')">
                                        {{ 'ERRORS.REQUIRED' | translate }}
                                    </div>
                                </div>
                            </div>

                            <div class="form__field">
                                <label
                                    for="confirm-password">{{ 'SETTINGS.MASTER_PASSWORD.CONFIRM' | translate }}</label>
                                <input
                                    (contextmenu)="variablesService.onContextMenuPasteSelect($event)"
                                    [class.invalid]="
                                    changeForm.invalid &&
                                    (changeForm.controls['new_confirmation'].dirty || changeForm.controls['new_confirmation'].touched) &&
                                    changeForm.errors &&
                                    changeForm.errors['mismatch'] &&
                                    changeForm.get('new_confirmation').value.length > 0
                                "
                                    class="form__field--input"
                                    formControlName="new_confirmation"
                                    id="confirm-password"
                                    placeholder="{{ 'PLACEHOLDERS.PLACEHOLDER_CONFIRM' | translate }}"
                                    type="password"
                                />
                                <div
                                    *ngIf="
                                    changeForm.invalid &&
                                    (changeForm.controls['new_confirmation'].dirty || changeForm.controls['new_confirmation'].touched) &&
                                    changeForm.errors &&
                                    changeForm.errors['mismatch'] &&
                                    changeForm.get('new_confirmation').value.length > 0
                                "
                                    class="error"
                                >
                                    {{ 'SETTINGS.FORM_ERRORS.CONFIRM_NOT_MATCH' | translate }}
                                </div>
                            </div>

                            <div class="submit-button-container">
                                <button [disabled]="!changeForm.valid" class="primary big max-w-19-rem w-100"
                                        type="submit">
                                    {{ 'SETTINGS.MASTER_PASSWORD.BUTTON' | translate }}
                                </button>
                                <span *ngIf="ifSaved" [class.active]="ifSaved" class="ml-1 color-aqua">{{
                                    'SETTINGS.SETTINGS_SAVED' | translate
                                    }}</span>
                            </div>
                        </form>
                        <p>Build version: {{ currentBuild }}</p>
                    </div>
                </div>
            </div>
        </div> `,
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .form__zano-companion--container {
                display: flex;
                flex-direction: column;
                padding: 2rem 2rem 0;
                border-radius: 8px;
                background-color: var(--blue-500);
            }

            .form__field--secret .form__field--input {
                padding-right: 4rem;
            }

            .btn--regenerate {
                padding: 4px;
                border-radius: 4px;
                position: absolute;
                right: 0.6rem;
                top: 3.6rem;
                background: #FFFFFF1A;
            }
        `,
    ],
})
export class SettingsComponent implements OnInit {
    ifSaved = false;

    scale: string;

    appUseTor: boolean;

    fb = inject(FormBuilder);

    changeForm = this.fb.group(
        {
            password: this.fb.nonNullable.control('', Validators.compose([Validators.pattern(regExpPassword)])),
            new_password: this.fb.nonNullable.control('', Validators.compose([Validators.required, Validators.pattern(regExpPassword)])),
            new_confirmation: this.fb.nonNullable.control(''),
            appPass: this.fb.nonNullable.control(this.variablesService.appPass ?? ''),
        },
        {
            validators: [
                ZanoValidators.formMatch('new_password', 'new_confirmation'),
                ZanoValidators.formMatch('password', 'appPass', 'pass_mismatch'),
            ],
        }
    );

    zanoCompanionForm = this.fb.group({
        secret: this.fb.nonNullable.control({ value: '', disabled: false }, {
            validators: Validators.compose([])
        }),
        port: this.fb.control({ value: `${this.variablesService.rpc_port}`, disabled: false }, {
            validators: Validators.compose([])
        }),
    });

    public currentNotificationsState;

    languagesOptions = [
        {
            name: 'en',
            language: 'SETTINGS.LANGUAGE.EN',
        },
        {
            name: 'fr',
            language: 'SETTINGS.LANGUAGE.FR',
        },
        {
            name: 'de',
            language: 'SETTINGS.LANGUAGE.DE',
        },
        {
            name: 'id',
            language: 'SETTINGS.LANGUAGE.ID',
        },
        {
            name: 'it',
            language: 'SETTINGS.LANGUAGE.IT',
        },
        {
            name: 'pt',
            language: 'SETTINGS.LANGUAGE.PT',
        },
    ];

    appLockOptions = [
        {
            time: 5,
            translationKey: 'SETTINGS.APP_LOCK.TIME1',
        },
        {
            time: 15,
            translationKey: 'SETTINGS.APP_LOCK.TIME2',
        },
        {
            time: 60,
            translationKey: 'SETTINGS.APP_LOCK.TIME3',
        },
        {
            time: 0,
            translationKey: 'SETTINGS.APP_LOCK.TIME4',
        },
    ];

    appScaleOptions = scaleItems;

    appLogOptions = [
        {
            id: -1,
        },
        {
            id: 0,
        },
        {
            id: 1,
        },
        {
            id: 2,
        },
        {
            id: 3,
        },
        {
            id: 4,
        },
    ];

    currentBuild = '';

    appPass: any;

    constructor(
        public translate: TranslateService,
        public variablesService: VariablesService,
        private renderer: Renderer2,
        private backend: BackendService,
        private ngZone: NgZone
    ) {
        this.scale = this.variablesService.settings.scale;
        this.appUseTor = this.variablesService.settings.appUseTor;
    }

    ngOnInit(): void {
        this.backend.getVersion((version, type, error) => {
            this.ngZone.run(() => {
                if (!error) {
                    this.currentBuild = version;
                    this.variablesService.testnet = false;
                    if (type === 'testnet') {
                        this.currentBuild += ' TESTNET';
                        this.variablesService.testnet = true;
                    }
                    this.variablesService.networkType = type;
                } else {
                    this.currentBuild = 'There was an error getting the build version';
                }
            });
        });
        this.backend.getIsDisabledNotifications(res => {
            this.currentNotificationsState = res;
        });
    }

    regenerateSecret(): void {
        this.zanoCompanionForm.get('secret').setValue(generateSecret(40));
    }

    setScale(): void {
        this.scale = this.variablesService.settings.scale;
        this.renderer.setStyle(document.documentElement, 'font-size', this.scale);
        this.backend.storeAppData();
    }

    onSubmitChangePass(): void {
        if (this.changeForm.valid) {
            this.variablesService.appPass = this.changeForm.get('new_password').value;

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
                        this.onSave();
                    });
                } else {
                    console.log(data['error_code']);
                }
            });

            this.changeForm.reset();
        }
    }

    toggleNotifications(): void {
        if (!this.currentNotificationsState) {
            this.backend.setIsDisabledNotifications('true');
            this.currentNotificationsState = true;
        } else {
            this.backend.setIsDisabledNotifications('false');
            this.currentNotificationsState = false;
        }
    }

    toggleUseTor(): void {
        this.appUseTor = !this.appUseTor;
        this.variablesService.settings.appUseTor = this.appUseTor;
        this.backend.setEnableTor(this.appUseTor);
        this.backend.storeAppData();
    }

    onSave(): void {
        this.ifSaved = true;
        setTimeout(() => {
            this.ifSaved = false;
        }, 3000);
    }

    onLockChange(): void {
        this.variablesService.restartCountdown();
    }

    onLogChange(): void {
        this.backend.setLogLevel(this.variablesService.settings.appLog);
        this.backend.storeAppData();
    }

    onLanguageChange(): void {
        this.translate.use(this.variablesService.settings.language);
        this.backend.storeAppData();
    }
}
