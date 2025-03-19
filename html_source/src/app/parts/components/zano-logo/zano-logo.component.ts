import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { VariablesService } from '@parts/services/variables.service';

@Component({
    selector: 'zano-zano-logo',
    standalone: true,
    imports: [CommonModule, FlexModule],
    templateUrl: './zano-logo.component.html',
    styleUrls: ['./zano-logo.component.scss']
})
export class ZanoLogoComponent {
    constructor(public variablesService: VariablesService) {}
}
