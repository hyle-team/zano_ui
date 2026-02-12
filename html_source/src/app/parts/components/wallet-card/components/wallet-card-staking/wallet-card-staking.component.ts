import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakingSwitchComponent } from '@parts/components/staking-switch.component';
import { TranslateModule } from '@ngx-translate/core';
import { Wallet } from '@api/models/wallet.model';
import { VariablesService } from '@parts/services/variables.service';

@Component({
    selector: 'zano-wallet-card-staking',
    standalone: true,
    imports: [CommonModule, StakingSwitchComponent, TranslateModule],
    templateUrl: './wallet-card-staking.component.html',
    styleUrls: ['./wallet-card-staking.component.scss'],
})
export class WalletCardStakingComponent {
    @Input() wallet: Wallet;

    constructor(public variablesService: VariablesService) {}
}
