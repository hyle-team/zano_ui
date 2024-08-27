import { inject, Injectable, NgZone } from '@angular/core';
import { ModalContainerComponent } from '../modals/modal-container/modal-container.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    private _count: number = 0;

    private readonly _matDialog: MatDialog = inject(MatDialog);

    private readonly _ngZone: NgZone = inject(NgZone);

    prepareModal(type: 'error' | 'info' | 'success' | string, message: any): void {
        const config: MatDialogConfig = {
            data: {
                type,
                message,
            },
            width: '34rem'
        };

        this._ngZone.run(() => {
            const matDialogRef: MatDialogRef<ModalContainerComponent> = this._matDialog.open(ModalContainerComponent, config);

            matDialogRef
                .afterOpened()
                .pipe(take(1))
                .subscribe(() => this._count + 1);
            matDialogRef
                .afterClosed()
                .pipe(take(1))
                .subscribe(() => this._count - 1);
        });
    }
}
