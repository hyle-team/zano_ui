import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wallet } from '@api/models/wallet.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'zano-wallet-card-name',
    standalone: true,
    imports: [CommonModule, MatTooltipModule],
    templateUrl: './wallet-card-name.component.html',
    styleUrls: ['./wallet-card-name.component.scss'],
})
export class WalletCardNameComponent {
    @Input() wallet: Wallet;

    constructor() {}
}
