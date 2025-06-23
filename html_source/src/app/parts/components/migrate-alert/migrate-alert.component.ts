import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ZARCANUM_MIGRATION } from '@parts/data/constants';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GetBareOutsStats } from '@api/models/rpc.models';
import { MigrateWalletToZarcanumComponent } from '../../../pages/wallet/wallet/dialogs/migrate-wallet-to-zarcanum/migrate-wallet-to-zarcanum.component';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';

@Component({
    selector: 'zano-migrate-alert',
    standalone: true,
    imports: [CommonModule, FlexModule, MatIconModule, TranslateModule],
    templateUrl: './migrate-alert.component.html',
    styleUrls: ['./migrate-alert.component.scss'],
})
export class MigrateAlertComponent {
    private readonly _backend: BackendService = inject(BackendService);
    private readonly _variablesService: VariablesService = inject(VariablesService);
    private readonly _ngZone: NgZone = inject(NgZone);
    private readonly _matDialog: MatDialog = inject(MatDialog);
    private readonly _modalService: ModalService = inject(ModalService);

    openZarcanumMigration(): void {
        this._backend.openUrlInBrowser(ZARCANUM_MIGRATION);
    }

    openMigrateWalletToZarcanum(): void {
        const {
            current_wallet: { wallet_id },
        } = this._variablesService;
        const params: ParamsCallRpc = {
            id: 0,
            jsonrpc: '2.0',
            method: 'get_bare_outs_stats',
            params: {},
        };
        this._backend.call_wallet_rpc([wallet_id, params], (status, response_data) => {
            this._ngZone.run(() => {
                if (response_data?.result) {
                    const data = response_data.result;

                    const config: MatDialogConfig<GetBareOutsStats> = {
                        data,
                        disableClose: false,
                    };
                    this._matDialog.open(MigrateWalletToZarcanumComponent, config);
                } else {
                    const message = response_data.error;
                    this._modalService.prepareModal('error', message);
                }
            });
        });
    }
}
