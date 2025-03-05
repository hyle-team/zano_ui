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
    styleUrls: ['./alias-controls.component.scss']
})
export class AliasControlsComponent implements OnInit {
    public readonly variablesService: VariablesService = inject(VariablesService);

    get isShowRegisterAlias(): boolean {
        const { current_wallet, daemon_state } = this.variablesService;

        if (!current_wallet) {
            return false;
        }

        const { alias, loaded, alias_available } = current_wallet;

        return !alias.hasOwnProperty('name') && loaded && daemon_state === 2 && alias_available;
    }

    get isShowAlias(): boolean {
        const { current_wallet, daemon_state } = this.variablesService;

        if (!current_wallet) {
            return false;
        }

        const { alias, loaded } = current_wallet;

        return alias.hasOwnProperty('name') && loaded && daemon_state === 2;
    }

    get isShowAliasButtons(): boolean {
        const { current_wallet, daemon_state } = this.variablesService;

        if (!current_wallet) {
            return false;
        }

        const { is_auditable, alias_available } = current_wallet;

        return !is_auditable && alias_available;
    }

    constructor() {}

    ngOnInit(): void {}
}
