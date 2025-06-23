import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'zano-shield-testnet',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './shield-testnet.component.html',
    styleUrls: ['./shield-testnet.component.scss'],
})
export class ShieldTestnetComponent {}
