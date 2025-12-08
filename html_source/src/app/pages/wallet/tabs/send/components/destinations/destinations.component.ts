import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationFormGroup } from '../../send.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { FormArray } from '@angular/forms';
import { DestinationComponent } from '../destination/destination.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';

@Component({
    selector: 'zano-destinations',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        TranslateModule,
        MatDividerModule,
        DestinationComponent,
        MatTooltipModule
    ],
    templateUrl: './destinations.component.html',
    styleUrls: ['./destinations.component.scss'],
})
export class DestinationsComponent {
    @Input('formArrayRef') formArray: FormArray<DestinationFormGroup>;

    @Output() onRemove = new EventEmitter<number>();

    @Output() onAdd = new EventEmitter<void>();

    remove(index: number) {
        this.onRemove.emit(index);
    }

    add() {
        this.onAdd.emit();
    }
}
