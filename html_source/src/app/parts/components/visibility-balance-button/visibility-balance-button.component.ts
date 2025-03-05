import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { VariablesService } from '@parts/services/variables.service';

@Component({
    selector: 'zano-visibility-balance-button',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './visibility-balance-button.component.html',
    styleUrls: ['./visibility-balance-button.component.scss']
})
export class VisibilityBalanceButtonComponent implements OnInit {
    public readonly variablesService: VariablesService = inject(VariablesService);

    constructor() {}

    ngOnInit(): void {}

    toggle(): void {
        this.variablesService.visibilityBalance$.next(!this.variablesService.visibilityBalance$.value);
    }
}
