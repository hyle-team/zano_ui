import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Wallet } from '@api/models/wallet.model';
import { VariablesService } from '@parts/services/variables.service';

@Component({
    selector: 'zano-wallet-card-progress',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './wallet-card-progress.component.html',
    styleUrls: ['./wallet-card-progress.component.scss'],
})
export class WalletCardProgressComponent {
    @Input() wallet: Wallet;

    constructor(public variablesService: VariablesService) {}
}
