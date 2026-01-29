import { Component, Input, NgZone } from '@angular/core';
import { Wallet } from '@api/models/wallet.model';
import { VariablesService } from '@parts/services/variables.service';
import { TranslateModule } from '@ngx-translate/core';
import { IntToMoneyPipeModule } from '@parts/pipes';
import { CommonModule } from '@angular/common';
import { DisablePriceFetchModule, TooltipModule } from '@parts/directives';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WalletCardButtonCloseComponent } from '@parts/components/wallet-card/components/wallet-card-button-close/wallet-card-button-close.component';
import { WalletCardNameComponent } from '@parts/components/wallet-card/components/wallet-card-name/wallet-card-name.component';
import { WalletCardBalanceComponent } from '@parts/components/wallet-card/components/wallet-card-balance/wallet-card-balance.component';
import { WalletCardStakingComponent } from '@parts/components/wallet-card/components/wallet-card-staking/wallet-card-staking.component';
import { WalletCardProgressComponent } from '@parts/components/wallet-card/components/wallet-card-progress/wallet-card-progress.component';
import { WalletCardAliasComponent } from '@parts/components/wallet-card/components/wallet-card-alias/wallet-card-alias.component';

@Component({
    selector: 'app-wallet-card',
    templateUrl: './wallet-card.component.html',
    styleUrls: ['./wallet-card.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TooltipModule,
        TranslateModule,
        IntToMoneyPipeModule,
        DisablePriceFetchModule,
        MatIconModule,
        MatTooltipModule,
        DragDropModule,
        WalletCardButtonCloseComponent,
        WalletCardNameComponent,
        WalletCardBalanceComponent,
        WalletCardStakingComponent,
        WalletCardProgressComponent,
        WalletCardAliasComponent,
    ],
})
export class WalletCardComponent {
    @Input() wallet: Wallet;

    constructor(public variablesService: VariablesService, private _ngZone: NgZone, private _router: Router) {}

    select(event: Event, id: number): void {
        event.preventDefault();
        event.stopPropagation();

        this._ngZone.run(() => {
            this.variablesService.setCurrentWallet(id);
            this._router.navigate(['/wallet/assets']).then();
        });
    }
}
