import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wallet } from '@api/models/wallet.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { TooltipDirective } from '@parts/directives';

@Component({
    selector: 'zano-wallet-card-alias',
    standalone: true,
    imports: [CommonModule, MatTooltipModule, MatIconModule, TooltipDirective],
    templateUrl: './wallet-card-alias.component.html',
    styleUrls: ['./wallet-card-alias.component.scss'],
})
export class WalletCardAliasComponent {
    @Input() wallet: Wallet;

    constructor() {}
}
