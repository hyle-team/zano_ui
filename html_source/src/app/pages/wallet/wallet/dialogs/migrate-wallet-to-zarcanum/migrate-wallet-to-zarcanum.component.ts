import { Component, inject, NgZone } from '@angular/core';
import { GetBareOutsStats, SweepBareOuts } from '@api/models/rpc.models';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { ModalService } from '@parts/services/modal.service';
import { SuccessSweepBareOutsComponent } from '../success-sweep-bare-outs/success-sweep-bare-outs.component';
import { ZARCANUM_MIGRATION } from '@parts/data/constants';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-migrate-wallet-to-zarcanum',
    templateUrl: './migrate-wallet-to-zarcanum.component.html',
    styleUrls: ['./migrate-wallet-to-zarcanum.component.scss'],
})
export class MigrateWalletToZarcanumComponent {
    readonly data: GetBareOutsStats = inject<GetBareOutsStats>(MAT_DIALOG_DATA);

    private readonly _matDialog: MatDialog = inject(MatDialog);

    private readonly _matDialogRef: MatDialogRef<MigrateWalletToZarcanumComponent> = inject(MatDialogRef);

    private readonly _backendService: BackendService = inject(BackendService);

    private readonly _variableService: VariablesService = inject(VariablesService);

    private readonly _modalService: ModalService = inject(ModalService);

    private readonly _ngZone: NgZone = inject(NgZone);

    migrate(): void {
        const {
            current_wallet: { wallet_id },
        } = this._variableService;

        const params: ParamsCallRpc = { id: 0, jsonrpc: '2.0', method: 'sweep_bare_outs', params: {} };
        this._backendService.call_wallet_rpc([wallet_id, params], (status, response_data) => {
            this._ngZone.run(() => {
                if (response_data?.result) {
                    const data = response_data.result;

                    const config: MatDialogConfig<SweepBareOuts> = {
                        data,
                    };

                    this._matDialog.open(SuccessSweepBareOutsComponent, config);
                } else {
                    const message = response_data.error;
                    this._modalService.prepareModal('error', message);
                }

                this._matDialogRef.close();
            });
        });
    }

    openZarcanumMigration(): void {
        this._backendService.openUrlInBrowser(ZARCANUM_MIGRATION);
    }
}
