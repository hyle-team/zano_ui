import { Renderer2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BackendService } from '@api/services/backend.service';
import { TranslateService } from '@ngx-translate/core';
import { VariablesService } from '@parts/services/variables.service';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent master password', () => {
    const newPassword = 'NewPassword123';
    const createVariables = () => ({
        appPass: 'abc',
        hasAppPass: true,
        appLogin: true,
        dataIsLoaded: true,
        settings: {
            scale: '10px',
            appUseTor: false,
            appLockTime: 5,
            zanoCompanionForm: { zanoCompation: false, secret: '' },
        },
        stopCountdown: jasmine.createSpy('stopCountdown'),
        startCountdown: jasmine.createSpy('startCountdown'),
    });
    let component: SettingsComponent;
    let variables: ReturnType<typeof createVariables>;
    let backend: jasmine.SpyObj<BackendService>;
    let finishSetPassword: (status: boolean) => void;
    let finishStore: (status: boolean) => void;

    beforeEach(() => {
        variables = createVariables();
        backend = jasmine.createSpyObj<BackendService>('BackendService', ['getOptions', 'setMasterPassword', 'storeSecureAppData']);
        backend.setMasterPassword.and.callFake((_, callback) => {
            finishSetPassword = callback;
        });
        backend.storeSecureAppData.and.callFake((callback) => {
            finishStore = callback;
        });
        TestBed.configureTestingModule({
            providers: [
                SettingsComponent,
                FormBuilder,
                { provide: VariablesService, useValue: variables },
                { provide: BackendService, useValue: backend },
                { provide: TranslateService, useValue: {} },
                { provide: Renderer2, useValue: {} },
                { provide: MatDialog, useValue: {} },
            ],
        });
        component = TestBed.inject(SettingsComponent);
        component.changeForm.patchValue({ password: variables.appPass, new_password: newPassword, new_confirmation: newPassword });
    });

    it('accepts matching legacy passwords without applying the rules for a new password', () => {
        for (const password of ['abc', 'legacy\\password', 'with spaces', 'пароль', 'a'.repeat(257)]) {
            variables.appPass = password;
            component.changeForm.patchValue({ password, appPass: password });
            expect(component.changeForm.valid).toBeTrue();

            component.changeForm.controls.password.setValue(password + '!');
            expect(component.changeForm.hasError('pass_mismatch')).toBeTrue();
        }
    });

    it('requires a valid new password and confirmation before calling the backend', () => {
        component.changeForm.patchValue({ new_password: '', new_confirmation: '' });
        expect(component.changeForm.controls.new_password.hasError('required')).toBeTrue();
        component.onSubmitChangePass();

        component.changeForm.patchValue({ new_password: 'short', new_confirmation: 'short' });
        expect(component.changeForm.controls.new_password.hasError('pattern')).toBeTrue();
        component.onSubmitChangePass();

        component.changeForm.patchValue({ new_password: newPassword, new_confirmation: 'DifferentPassword123' });
        expect(component.changeForm.hasError('mismatch')).toBeTrue();
        component.onSubmitChangePass();

        expect(backend.setMasterPassword).not.toHaveBeenCalled();
        expect(backend.storeSecureAppData).not.toHaveBeenCalled();
        expect(variables.stopCountdown).not.toHaveBeenCalled();
    });

    it('retains the session password and form when setting the password fails', () => {
        const formValue = component.changeForm.getRawValue();
        component.onSubmitChangePass();
        finishSetPassword(false);

        expect(variables.appPass).toBe('abc');
        expect(component.changeForm.getRawValue()).toEqual(formValue);
        expect(backend.storeSecureAppData).not.toHaveBeenCalled();
        expect(component.masterPasswordSaveError).toBeTrue();
        expect(component.isMasterPasswordSaving).toBeFalse();
        expect(component.ifSaved).toBeFalse();
        expect(variables.startCountdown).toHaveBeenCalledTimes(1);
    });

    it('waits for a successful file write, rejects duplicate submits and allows retry after a failed write', fakeAsync(() => {
        const pendingFormValue = { ...component.changeForm.getRawValue(), password: newPassword, appPass: newPassword };
        component.onSubmitChangePass();
        component.onSubmitChangePass();
        expect(backend.setMasterPassword).toHaveBeenCalledOnceWith({ pass: newPassword }, jasmine.any(Function));
        expect(backend.storeSecureAppData).not.toHaveBeenCalled();
        expect(variables.appPass).toBe('abc');

        finishSetPassword(true);
        component.onSubmitChangePass();
        expect(backend.setMasterPassword).toHaveBeenCalledTimes(1);
        expect(backend.storeSecureAppData).toHaveBeenCalledOnceWith(jasmine.any(Function));
        expect(variables.appPass).toBe(newPassword);
        expect(component.isMasterPasswordSaving).toBeTrue();
        expect(component.ifSaved).toBeFalse();
        expect(component.changeForm.getRawValue()).toEqual(pendingFormValue);
        expect(variables.startCountdown).not.toHaveBeenCalled();

        finishStore(false);
        expect(component.masterPasswordSaveError).toBeTrue();
        expect(component.isMasterPasswordSaving).toBeFalse();
        expect(component.ifSaved).toBeFalse();
        expect(component.changeForm.getRawValue()).toEqual(pendingFormValue);
        expect(variables.appPass).toBe(newPassword);
        expect(component.changeForm.valid).toBeTrue();
        component.changeForm.controls.password.setValue('abc');
        expect(component.changeForm.hasError('pass_mismatch')).toBeTrue();
        component.changeForm.controls.password.setValue(newPassword);
        expect(component.changeForm.valid).toBeTrue();

        component.onSubmitChangePass();
        finishSetPassword(true);
        expect(backend.setMasterPassword).toHaveBeenCalledTimes(2);
        expect(backend.storeSecureAppData).toHaveBeenCalledTimes(2);
        expect(component.ifSaved).toBeFalse();
        expect(component.changeForm.getRawValue()).toEqual(pendingFormValue);

        finishStore(true);
        expect(component.masterPasswordSaveError).toBeFalse();
        expect(component.isMasterPasswordSaving).toBeFalse();
        expect(component.ifSaved).toBeTrue();
        expect(component.changeForm.getRawValue()).toEqual({
            password: '',
            new_password: '',
            new_confirmation: '',
            appPass: newPassword,
        });
        expect(variables.appLogin).toBeTrue();
        expect(variables.dataIsLoaded).toBeTrue();
        tick(3000);
    }));

    it('does not start auto-lock after the first master password file write fails', () => {
        variables.appPass = '';
        variables.dataIsLoaded = false;
        component.changeForm.patchValue({ password: '', appPass: '' });
        component.onSubmitChangePass();
        finishSetPassword(true);
        finishStore(false);

        expect(variables.appPass).toBe(newPassword);
        expect(variables.dataIsLoaded).toBeFalse();
        expect(component.masterPasswordSaveError).toBeTrue();
        expect(component.changeForm.valid).toBeTrue();
        expect(variables.startCountdown).not.toHaveBeenCalled();
    });
});
