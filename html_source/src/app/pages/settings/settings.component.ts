import { Component, inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { scaleItems } from '@parts/data/scale-items';
import { regExpPassword, ZanoValidators } from '@parts/utils/zano-validators';
import { generateRandomString } from '@parts/utils/generate-random-string';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: [`./settings.component.scss`],
})
export class SettingsComponent implements OnInit {
    ifSaved = false;

    isSecretWasCopied: boolean = false;

    secretWasCopiedTimeout;

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

    zanoCompanionForm: FormGroup<{
        zanoCompation: FormControl<boolean>;
        secret: FormControl<string>;
    }> = this.fb.group({
        zanoCompation: this.fb.nonNullable.control({ value: false, disabled: !this.variablesService.hasAppPass }),
        secret: this.fb.nonNullable.control(
            { value: '', disabled: false },
            {
                validators: Validators.compose([]),
            }
        ),
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
        public backend: BackendService,
        private ngZone: NgZone
    ) {
        this.scale = this.variablesService.settings.scale;
        this.appUseTor = this.variablesService.settings.appUseTor;
        this.zanoCompanionForm.setValue(this.variablesService.settings.zanoCompanionForm, { emitEvent: false });

        this.backend.getOptions();
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

        this.backend.getIsDisabledNotifications(state => {
            this.currentNotificationsState = state;
        });

        this.zanoCompanionForm.valueChanges.pipe(debounceTime(200)).subscribe({
            next: () => {
                const value = this.zanoCompanionForm.getRawValue();
                const { zanoCompation, secret } = value;

                if (zanoCompation && !secret) {
                    this.generateSecret();
                    return;
                }

                if (!zanoCompation && secret) {
                    this.zanoCompanionForm.controls.secret.patchValue('');
                    return;
                }

                if ((zanoCompation && secret) || (!zanoCompation && !secret)) {
                    this.backend.setupJwtWalletRpc(value);
                    return;
                }
            },
        });
    }

    copySecret(): void {
        const { secret } = this.zanoCompanionForm.getRawValue();

        this.backend.setClipboard(secret);

        this.isSecretWasCopied = true;
        this.secretWasCopiedTimeout = setTimeout(() => {
            this.isSecretWasCopied = false;
            clearTimeout(this.secretWasCopiedTimeout);
        }, 3000);
    }

    private generateSecret(): void {
        this.zanoCompanionForm.get('secret').setValue(generateRandomString(40));
    }

    regenerateSecret(): void {
        this.generateSecret();
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
                        this.zanoCompanionForm.controls.zanoCompation.enable({ emitEvent: false });
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

    showPrice(): void {
        this.variablesService.visibilityBalance$.next(!this.variablesService.visibilityBalance$.value);
        this.backend.storeAppData();
    }
}
