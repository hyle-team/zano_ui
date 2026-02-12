import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TooltipDirective } from '@parts/directives';
import { RouterLink } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { AutoFocusDirective } from '@parts/directives/autofocus.directive';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'zano-my-aliases-dialog',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        MatDialogModule,
        MatIconModule,
        TooltipDirective,
        RouterLink,
        AutoFocusDirective,
        MatTooltipModule,
    ],
    templateUrl: './my-aliases-dialog.component.html',
    styleUrls: ['./my-aliases-dialog.component.scss'],
})
export class MyAliasesDialogComponent {
    variablesService: VariablesService = inject(VariablesService);

    get isShowAliasButtons(): boolean {
        const { current_wallet } = this.variablesService;

        if (!current_wallet) {
            return false;
        }

        const { is_watch_only, alias_available } = current_wallet;

        return !is_watch_only && alias_available;
    }
}
