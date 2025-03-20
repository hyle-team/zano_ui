import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss'],
    standalone: true,
    imports: [CommonModule, MatDialogModule, TranslateModule, FlexModule, MatIconModule]
})
export class ModalContainerComponent {
    public readonly data: { type: 'error' | 'info' | 'success'; message: any } = inject(MAT_DIALOG_DATA);
}
