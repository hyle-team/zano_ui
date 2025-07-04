import { Component, Input } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '../services/variables.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-copy-button',
    template: `
        <button (click)="copy()" [classList]="'btn-icon circle' + ' ' + size" type="button" [attr.aria-label]="'COMMON.COPY' | translate">
            <mat-icon [class]="size" [svgIcon]="copyAnimation ? 'zano-check' : 'zano-copy'"></mat-icon>
        </button>
    `,
    styles: [],
    standalone: true,
    imports: [CommonModule, MatIconModule, TranslateModule],
})
export class CopyButtonComponent {
    @Input() value: string;

    @Input() size: 'small' | 'big' = 'small';

    copyAnimation = false;

    copyAnimationTimeout;

    constructor(private backend: BackendService, public variablesService: VariablesService) {}

    copy(): void {
        this.backend.setClipboard(this.value || '');
        this.copyAnimation = true;
        this.copyAnimationTimeout = window.setTimeout(() => {
            this.copyAnimation = false;
            clearTimeout(this.copyAnimationTimeout);
        }, 2000);
    }
}
