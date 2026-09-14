import { Component, inject, NgZone, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { REG_EXP_PASSWORD, ZanoValidators } from '@parts/utils/zano-validators';
import { generateRandomString } from '@parts/utils/generate-random-string';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { currenciesItems } from '@parts/data/currencies';
import { AppLogItems } from '@parts/interfaces/app-log-items.interface';
import { AppScaleItems } from '@parts/interfaces/app-scale-items.interface';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: [`./settings.component.scss`],
})
export class SettingsComponent implements OnInit, OnDestroy {
    @ViewChild('clearLogsDialog') private clearLogsDialog: TemplateRef<unknown>;

    logFilesSize: number | null = null;

    isLogSizeLoading = false;

    isClearingLogs = false;

    isClearLogsConfirmationOpen = false;

    logClearResult: 'error' | null = null;

    private readonly destroy$ = new Subject<void>();

    private clearLogsDialogRef: MatDialogRef<unknown, boolean> | undefined;

    ifSaved = false;

    isSecretWasCopied = false;

    secretWasCopiedTimeout: any;

    isBuildVersionWasCopied = false;

    buildVersionWasCopiedTimeout: any;

    scale: string;

    appUseTor: boolean;

    fb = inject(FormBuilder);

    changeForm = this.fb.group(
        {
            password: this.fb.nonNullable.control('', Validators.compose([Validators.pattern(REG_EXP_PASSWORD)])),
            new_password: this.fb.nonNullable.control('', Validators.compose([Validators.pattern(REG_EXP_PASSWORD)])),
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

    appScaleOptions: AppScaleItems = [
        {
            value: '8px',
            label: 'SETTINGS.SCALE.75',
        },
        {
            value: '10px',
            label: 'SETTINGS.SCALE.100',
        },
        {
            value: '12px',
            label: 'SETTINGS.SCALE.125',
        },
        {
            value: '14px',
            label: 'SETTINGS.SCALE.150',
        },
    ];

    appLogItems: AppLogItems = [
        {
            id: -1,
            label: 'LOG_ITEMS.LABEL1',
        },
        {
            id: 0,
            label: 'LOG_ITEMS.LABEL2',
        },
        {
            id: 1,
            label: 'LOG_ITEMS.LABEL3',
        },
        {
            id: 2,
            label: 'LOG_ITEMS.LABEL4',
        },
        {
            id: 3,
            label: 'LOG_ITEMS.LABEL5',
            type: 'WARNING',
        },
        {
            id: 4,
            label: 'LOG_ITEMS.LABEL6',
            type: 'WARNING',
        },
    ];

    appPass: any;

    constructor(
        public translate: TranslateService,
        public variablesService: VariablesService,
        private renderer: Renderer2,
        public backend: BackendService,
        private ngZone: NgZone,
        private matDialog: MatDialog
    ) {
        this.scale = this.variablesService.settings.scale;
        this.appUseTor = this.variablesService.settings.appUseTor;
        this.zanoCompanionForm.setValue(this.variablesService.settings.zanoCompanionForm, { emitEvent: false });

        this.backend.getOptions();
    }

    ngOnInit(): void {
        this.refreshLogFilesSize();

        this.backend.getIsDisabledNotifications((state) => {
            this.currentNotificationsState = !state;
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.clearLogsDialogRef?.close(false);
    }

    get formattedLogFilesSize(): string {
        if (this.logFilesSize === null) {
            return '';
        }

        const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
        let size = this.logFilesSize;
        let unit = 0;

        while (size >= 1000 && unit < units.length - 1) {
            size /= 1000;
            unit++;
        }

        if (unit > 0) {
            size = Math.round(size * 10) / 10;
            // Use the next unit when rounding would otherwise show 1000.0.
            if (size >= 1000 && unit < units.length - 1) {
                size /= 1000;
                unit++;
            }
        }

        const value = new Intl.NumberFormat(this.variablesService.settings.language, {
            minimumFractionDigits: unit === 0 ? 0 : 1,
            maximumFractionDigits: unit === 0 ? 0 : 1,
        }).format(size);
        return `${value} ${units[unit]}`;
    }

    get canClearLogs(): boolean {
        return (
            (this.logFilesSize === null || this.logFilesSize > 0) &&
            !this.isLogSizeLoading &&
            !this.isClearingLogs &&
            !this.isClearLogsConfirmationOpen
        );
    }

    refreshLogFilesSize(): void {
        if (this.isLogSizeLoading || this.isClearingLogs || this.isClearLogsConfirmationOpen) {
            return;
        }

        this.isLogSizeLoading = true;
        this.backend
            .getLogFilesSize()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.ngZone.run(() => {
                        const size = response?.response_data?.total_size;
                        this.logFilesSize = response?.error_code === 'OK' && Number.isSafeInteger(size) && size >= 0 ? size : null;
                        this.isLogSizeLoading = false;
                    });
                },
                error: () => {
                    this.ngZone.run(() => {
                        this.logFilesSize = null;
                        this.isLogSizeLoading = false;
                    });
                },
            });
    }

    confirmClearLogs(): void {
        if (!this.canClearLogs) {
            return;
        }

        this.isClearLogsConfirmationOpen = true;
        this.clearLogsDialogRef = this.matDialog.open<unknown, unknown, boolean>(this.clearLogsDialog, {
            width: '42rem',
            disableClose: false,
            autoFocus: '#clear-logs-cancel',
            restoreFocus: true,
            ariaLabelledBy: 'clear-logs-title',
            ariaDescribedBy: 'clear-logs-description',
        });
        this.clearLogsDialogRef
            .beforeClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                // Re-enable the trigger before Material restores focus to it.
                this.isClearLogsConfirmationOpen = false;
            });
        this.clearLogsDialogRef
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((confirmed) => {
                this.clearLogsDialogRef = undefined;
                if (confirmed) {
                    this.clearLogs();
                }
            });
    }

    private clearLogs(): void {
        this.isClearingLogs = true;
        this.logClearResult = null;
        this.backend
            .clearLogFiles()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => this.finishClearingLogs(response?.error_code === 'OK'),
                error: () => this.finishClearingLogs(false),
            });
    }

    private finishClearingLogs(success: boolean): void {
        this.ngZone.run(() => {
            this.isClearingLogs = false;
            this.logClearResult = success ? null : 'error';
            // Failed clearing can still have removed some logs. Always read the actual size.
            this.refreshLogFilesSize();
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

    copyBuildVersion(): void {
        this.backend.setClipboard(`${this.translate.instant('COMMON.BUILD_VERSION')}: ${this.variablesService.buildVersion}`);

        this.isBuildVersionWasCopied = true;
        this.buildVersionWasCopiedTimeout = setTimeout(() => {
            this.isBuildVersionWasCopied = false;
            clearTimeout(this.buildVersionWasCopiedTimeout);
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

            this.changeForm.reset({ appPass: this.variablesService.appPass });
        }
    }

    toggleNotifications(): void {
        if (!this.currentNotificationsState) {
            this.backend.setIsDisabledNotifications('false');
            this.currentNotificationsState = true;
        } else {
            this.backend.setIsDisabledNotifications('true');
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

    onCurrencyChange(): void {
        this.backend.storeAppData();
    }

    toggleVisibilityBalance(): void {
        this.variablesService.visibilityBalance$.next(!this.variablesService.visibilityBalance$.value);
        this.backend.storeAppData();
    }

    toggleDarkTheme(): void {
        const { settings, isDarkTheme$ } = this.variablesService;
        const isDarkTheme = !settings.isDarkTheme;
        this.variablesService.settings.isDarkTheme = isDarkTheme;
        isDarkTheme$.next(isDarkTheme);

        this.backend.storeAppData();
    }

    protected readonly currenciesItems = currenciesItems;
}
