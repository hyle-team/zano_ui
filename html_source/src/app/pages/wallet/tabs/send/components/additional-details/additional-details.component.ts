import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeFieldComponent } from '../fee-field/fee-field.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { TransferFormGroup } from '../../send.component';

@Component({
    selector: 'zano-additional-details',
    standalone: true,
    imports: [CommonModule, FeeFieldComponent, MatIconModule, TranslateModule],
    templateUrl: './additional-details.component.html',
    styleUrls: ['./additional-details.component.scss'],
})
export class AdditionalDetailsComponent {
    @Input()
    show = false;

    @Output()
    showChange = new EventEmitter<boolean>();

    @Input()
    formRef: TransferFormGroup;

    toggle() {
        this.show = !this.show;
        this.showChange.emit(this.show);
    }
}
