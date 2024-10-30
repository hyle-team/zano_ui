import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { IsAvailableAliasNamePipeModule } from '@parts/pipes';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from '@parts/directives';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';

@Component({
    selector: 'zano-alias-controls',
    standalone: true,
    imports: [CommonModule, FlexModule, IsAvailableAliasNamePipeModule, MatIconModule, TooltipModule, TranslateModule, RouterLink],
    templateUrl: './alias-controls.component.html',
    styleUrls: ['./alias-controls.component.scss'],
})
export class AliasControlsComponent implements OnInit {
    public readonly variablesService: VariablesService = inject(VariablesService);

    get isShowRegisterAlias(): boolean {
        const { currentWallet, daemon_state } = this.variablesService;

        if (!currentWallet) {
            return false;
        }

        const { alias, loaded, alias_available } = currentWallet;

        return !alias.hasOwnProperty('name') && loaded && daemon_state === 2 && alias_available;
    }

    get isShowAlias(): boolean {
        const { currentWallet, daemon_state } = this.variablesService;

        if (!currentWallet) {
            return false;
        }

        const { alias, loaded } = currentWallet;

        return alias.hasOwnProperty('name') && loaded && daemon_state === 2;
    }

    get isShowAliasButtons(): boolean {
        const { currentWallet, daemon_state } = this.variablesService;

        if (!currentWallet) {
            return false;
        }

        const { is_auditable, alias_available } = currentWallet;

        return !is_auditable && alias_available;
    }

    constructor() {}

    ngOnInit(): void {}
}
