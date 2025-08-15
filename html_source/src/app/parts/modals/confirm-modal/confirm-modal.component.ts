import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmModalData {
    title: string;
    message?: string;
    buttons?: Partial<{
        close: Partial<{
            text: string;
            style: 'primary' | 'outline';
        }>;
        submit: Partial<{
            text: string;
            style: 'primary' | 'outline';
        }>;
    }>;
}

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent {
    data: ConfirmModalData = inject(MAT_DIALOG_DATA);

    private _dialogRef: MatDialogRef<ConfirmModalComponent> = inject(MatDialogRef);

    get title(): string {
        const { title } = this.data;
        return title;
    }

    get message(): string {
        const { message } = this.data;
        return message;
    }

    submit(): void {
        this._dialogRef.close(true);
    }
}
