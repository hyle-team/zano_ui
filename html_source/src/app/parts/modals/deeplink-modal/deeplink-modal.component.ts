import { Component, inject } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { Router } from '@angular/router';
import { DeeplinkResponse } from '@api/models/deeplink.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgIf } from '@angular/common';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';

@Component({
    selector: 'app-deeplink-modal',
    standalone: true,
    imports: [MatDialogModule, TranslateModule, NgSelectModule, ReactiveFormsModule, NgIf, IsVisibleControlErrorPipe],
    templateUrl: './deeplink-modal.component.html',
    styleUrls: ['./deeplink-modal.component.scss'],
})
export class DeeplinkModalComponent {
    private readonly _matDialogRef: MatDialogRef<DeeplinkModalComponent> = inject(MatDialogRef);
    private readonly _router = inject(Router);
    readonly variablesService = inject(VariablesService);

    readonly deeplinkResponse = inject<DeeplinkResponse>(MAT_DIALOG_DATA);

    readonly availableWallets = this.variablesService.wallets.filter(
        (wallet) => !wallet.is_watch_only || !wallet.is_auditable || wallet.loaded
    );

    readonly walletIdControl = new FormControl<number | null>(this.availableWallets[0]?.wallet_id ?? null, [
        Validators.required,
        this._walletHasAssetValidator.bind(this),
    ]);

    constructor() {
        this.walletIdControl.markAsTouched();
        this.walletIdControl.updateValueAndValidity({ emitEvent: false });
    }

    submit(): void {
        if (this.walletIdControl.invalid) {
            this.walletIdControl.markAsTouched();
            return;
        }

        const walletId = this.walletIdControl.value;

        this.variablesService.setCurrentWallet(walletId);

        this.variablesService.deeplinkResponse$.next(this.deeplinkResponse);
        this._router
            .navigate(['/wallet/send'], {
                state: {
                    deeplinkResponse: this.deeplinkResponse,
                },
            })
            .then(() => {
                this._matDialogRef.close();
            });
    }

    private _walletHasAssetValidator(control: AbstractControl<number | null>): ValidationErrors | null {
        const walletId = control.value;
        if (walletId === null || walletId === undefined) {
            return null;
        }

        const wallet = this.availableWallets.find((item) => item.wallet_id === walletId);
        if (!wallet) {
            return { walletNotFound: true };
        }

        const hasAsset = wallet.balances.some(({ asset_info }) => asset_info.asset_id === this.deeplinkResponse.asset_id);
        return hasAsset ? null : { walletHasNoAsset: true };
    }
}
