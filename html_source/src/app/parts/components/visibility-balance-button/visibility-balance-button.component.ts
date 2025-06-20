import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { VariablesService } from '@parts/services/variables.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'zano-visibility-balance-button',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule, TranslateModule],
    templateUrl: './visibility-balance-button.component.html',
    styleUrls: ['./visibility-balance-button.component.scss']
})
export class VisibilityBalanceButtonComponent {
    public readonly variablesService: VariablesService = inject(VariablesService);
}
