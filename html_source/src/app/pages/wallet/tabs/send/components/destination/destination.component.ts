import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DestinationFormGroup } from '../../send.component';
import { AssetFieldComponent } from '../asset-field/asset-field.component';
import { AddressFieldComponent } from '../address-field/address-field.component';
import { AmountFieldComponent } from '../amount-field/amount-field.component';
import { WrapInformationComponent } from '../wrap-information/wrap-information.component';

@Component({
    selector: 'zano-destination',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        TranslateModule,
        AssetFieldComponent,
        AddressFieldComponent,
        AmountFieldComponent,
        WrapInformationComponent,
    ],
    templateUrl: './destination.component.html',
    styleUrls: ['./destination.component.scss'],
})
export class DestinationComponent {
    @Input() index: number;

    @Input() hideRemove: boolean = true;

    @Input('formRef') form: DestinationFormGroup;

    @Output() onRemove = new EventEmitter<void>();

    remove() {
        this.onRemove.emit();
    }
}
