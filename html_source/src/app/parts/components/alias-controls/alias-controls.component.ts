import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { IsAvailableAliasNamePipeModule } from '@parts/pipes';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from '@parts/directives';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { MatDialog } from '@angular/material/dialog';
import { MyAliasesDialogComponent } from '../../../pages/wallet/wallet/dialogs/my-aliases-dialog/my-aliases-dialog.component';

@Component({
    selector: 'zano-alias-controls',
    standalone: true,
    imports: [CommonModule, FlexModule, IsAvailableAliasNamePipeModule, MatIconModule, TooltipModule, TranslateModule, RouterLink],
    templateUrl: './alias-controls.component.html',
    styleUrls: ['./alias-controls.component.scss'],
})
export class AliasControlsComponent {
    public readonly variablesService: VariablesService = inject(VariablesService);

    private readonly _matDialog: MatDialog = inject(MatDialog);

    get isShowAssignAlias(): boolean {
        const { current_wallet, daemon_state, testnet } = this.variablesService;

        if (!current_wallet || daemon_state !== 2) {
            return false;
        }

        const { alias_info, loaded, alias_available, is_watch_only } = current_wallet;

        if (!loaded || !alias_available || is_watch_only) {
            return false;
        }

        return testnet || !Boolean(alias_info);
    }

    get isShowAlias(): boolean {
        const { current_wallet, daemon_state } = this.variablesService;

        if (!current_wallet || daemon_state !== 2) {
            return false;
        }

        const { alias_info, loaded, alias_available } = current_wallet;

        if (!loaded || !alias_available) {
            return false;
        }

        return Boolean(alias_info);
    }

    openMyAliasesDialog(): void {
        this._matDialog.open(MyAliasesDialogComponent, { width: '44rem' });
    }
}
