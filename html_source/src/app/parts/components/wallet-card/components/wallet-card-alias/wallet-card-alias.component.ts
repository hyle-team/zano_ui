import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wallet } from '@api/models/wallet.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from '@parts/directives';

@Component({
    selector: 'zano-wallet-card-alias',
    standalone: true,
    imports: [CommonModule, MatTooltipModule, MatIconModule, TooltipModule],
    templateUrl: './wallet-card-alias.component.html',
    styleUrls: ['./wallet-card-alias.component.scss'],
})
export class WalletCardAliasComponent {
    @Input() wallet: Wallet;

    constructor() {}
}
