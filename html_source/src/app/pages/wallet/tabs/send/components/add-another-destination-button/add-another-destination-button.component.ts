import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'zano-add-another-destination-button',
    standalone: true,
    imports: [CommonModule, MatIconModule, TranslateModule, MatTooltipModule],
    templateUrl: './add-another-destination-button.component.html',
    styleUrls: ['./add-another-destination-button.component.scss'],
})
export class AddAnotherDestinationButtonComponent {
    @Input() disabled = false;
}
