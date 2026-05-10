import { inject, Injectable, NgZone } from '@angular/core';
import { ModalContainerComponent } from '../modals/modal-container/modal-container.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    private readonly _matDialog: MatDialog = inject(MatDialog);

    private readonly _ngZone: NgZone = inject(NgZone);

    prepareModal(type: 'error' | 'info' | 'success' | string, message: any): void {
        const config: MatDialogConfig = {
            data: {
                type,
                message,
            },
            width: '34rem',
        };

        this._ngZone.run(() => {
            this._matDialog.open(ModalContainerComponent, config);
        });
    }
}
