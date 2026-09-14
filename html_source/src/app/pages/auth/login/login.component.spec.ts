import { TestBed } from '@angular/core/testing';
import { FormBuilder, NonNullableFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { NavigationService } from '@parts/services/back.service';
import { VariablesService } from '@parts/services/variables.service';
import { WalletsService } from '@parts/services/wallets.service';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';

describe('LoginComponent master password creation', () => {
    const newPassword = 'NewPassword123';
    const createVariables = () => ({
        appPass: '',
        appLogin: false,
        dataIsLoaded: false,
        settings: { appLockTime: 5 },
        startCountdown: jasmine.createSpy('startCountdown'),
    });
    let component: LoginComponent;
    let variables: ReturnType<typeof createVariables>;
    let backend: jasmine.SpyObj<BackendService>;
    let router: jasmine.SpyObj<Router>;
    let finishSetPassword: (status: boolean) => void;
    let finishStore: (status: boolean) => void;

    beforeEach(() => {
        variables = createVariables();
        backend = jasmine.createSpyObj<BackendService>('BackendService', ['setMasterPassword', 'storeSecureAppData']);
        backend.setMasterPassword.and.callFake((_, callback) => {
            finishSetPassword = callback;
        });
        backend.storeSecureAppData.and.callFake((callback) => {
            finishStore = callback;
        });
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);
        router.navigate.and.returnValue(Promise.resolve(true));
        TestBed.configureTestingModule({
            providers: [
                LoginComponent,
                FormBuilder,
                { provide: NonNullableFormBuilder, useFactory: (fb: FormBuilder) => fb.nonNullable, deps: [FormBuilder] },
                { provide: VariablesService, useValue: variables },
                { provide: WalletsService, useValue: {} },
                { provide: BackendService, useValue: backend },
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
                { provide: MatDialog, useValue: {} },
                { provide: NavigationService, useValue: {} },
            ],
        });
        component = TestBed.inject(LoginComponent);
    });

    it('allows initial Skip without choosing a password', () => {
        expect(component.regMasterPassForm.invalid).toBeTrue();
        component.onSkipCreatePass();

        expect(backend.setMasterPassword).not.toHaveBeenCalled();
        expect(backend.storeSecureAppData).not.toHaveBeenCalled();
        expect(variables.appPass).toBe('');
        expect(variables.appLogin).toBeTrue();
        expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
    });

    it('allows the auth Reset flow to finish while an authentication request is pending', () => {
        component.type = 'auth';
        component.submitLoading = true;
        component.onSkipCreatePass();

        expect(variables.appLogin).toBeTrue();
        expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
    });

    it('does not submit empty, invalid or mismatched passwords', () => {
        expect(component.regMasterPassForm.controls.password.hasError('required')).toBeTrue();
        component.onSubmitCreatePass();

        component.regMasterPassForm.setValue({ password: 'short', confirmation: 'short' });
        expect(component.regMasterPassForm.controls.password.hasError('pattern')).toBeTrue();
        component.onSubmitCreatePass();

        component.regMasterPassForm.setValue({ password: newPassword, confirmation: 'DifferentPassword123' });
        expect(component.regMasterPassForm.hasError('mismatch')).toBeTrue();
        component.onSubmitCreatePass();

        expect(backend.setMasterPassword).not.toHaveBeenCalled();
        expect(backend.storeSecureAppData).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('keeps the session password unchanged when setting it fails', () => {
        component.regMasterPassForm.setValue({ password: newPassword, confirmation: newPassword });
        component.onSubmitCreatePass();
        finishSetPassword(false);

        expect(variables.appPass).toBe('');
        expect(component.regMasterPassForm.getRawValue()).toEqual({ password: newPassword, confirmation: newPassword });
        expect(backend.storeSecureAppData).not.toHaveBeenCalled();
        expect(component.submitLoading).toBeFalse();
        expect(component.masterPasswordSaveError).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
        expect(variables.startCountdown).not.toHaveBeenCalled();
    });

    it('blocks duplicates and Skip while saving and navigates only after a successful write on retry', () => {
        const formValue = { password: newPassword, confirmation: newPassword };
        component.regMasterPassForm.setValue(formValue);
        component.onSubmitCreatePass();
        component.onSubmitCreatePass();
        component.onSkipCreatePass();
        expect(backend.setMasterPassword).toHaveBeenCalledOnceWith({ pass: newPassword }, jasmine.any(Function));
        expect(backend.storeSecureAppData).not.toHaveBeenCalled();
        expect(variables.appPass).toBe('');
        expect(router.navigate).not.toHaveBeenCalled();

        finishSetPassword(true);
        component.onSubmitCreatePass();
        component.onSkipCreatePass();
        expect(backend.setMasterPassword).toHaveBeenCalledTimes(1);
        expect(backend.storeSecureAppData).toHaveBeenCalledOnceWith(jasmine.any(Function));
        expect(component.submitLoading).toBeTrue();
        expect(variables.appPass).toBe(newPassword);
        expect(component.regMasterPassForm.getRawValue()).toEqual(formValue);
        expect(router.navigate).not.toHaveBeenCalled();
        expect(variables.startCountdown).not.toHaveBeenCalled();

        finishStore(false);
        component.onSkipCreatePass();
        expect(component.masterPasswordSaveError).toBeTrue();
        expect(component.submitLoading).toBeFalse();
        expect(variables.appPass).toBe(newPassword);
        expect(variables.appLogin).toBeFalse();
        expect(variables.dataIsLoaded).toBeFalse();
        expect(component.regMasterPassForm.getRawValue()).toEqual(formValue);
        expect(router.navigate).not.toHaveBeenCalled();

        component.onSubmitCreatePass();
        finishSetPassword(true);
        expect(backend.setMasterPassword).toHaveBeenCalledTimes(2);
        expect(backend.storeSecureAppData).toHaveBeenCalledTimes(2);
        expect(router.navigate).not.toHaveBeenCalled();
        expect(variables.startCountdown).not.toHaveBeenCalled();

        finishStore(true);
        expect(component.masterPasswordSaveError).toBeFalse();
        expect(component.submitLoading).toBeFalse();
        expect(variables.appPass).toBe(newPassword);
        expect(variables.appLogin).toBeTrue();
        expect(variables.dataIsLoaded).toBeTrue();
        expect(variables.startCountdown).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledOnceWith(['/']);
    });
});
