import { Component, inject, NgZone } from '@angular/core';
import { GetBareOutsStats, SweepBareOuts } from '@api/models/rpc.models';
import { Dialog, DIALOG_DATA, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ParamsCallRpc } from '@api/models/call_rpc.model';
import { ModalService } from '@parts/services/modal.service';
import { SuccessSweepBareOutsComponent } from '../success-sweep-bare-outs/success-sweep-bare-outs.component';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ZARCANUM_MIGRATION } from '@parts/data/constants';

@Component({
    selector: 'app-migrate-wallet-to-zarcanum',
    templateUrl: './migrate-wallet-to-zarcanum.component.html',
    styleUrls: ['./migrate-wallet-to-zarcanum.component.scss'],
})
export class MigrateWalletToZarcanumComponent {
    readonly dialogData: GetBareOutsStats = inject<GetBareOutsStats>(DIALOG_DATA);
    private readonly _scrollStrategyOptions: ScrollStrategyOptions = inject(ScrollStrategyOptions);
    private readonly _scrollStrategyNoop: ScrollStrategy = this._scrollStrategyOptions.noop();
    private readonly _dialog = inject(Dialog);
    private readonly _dialogRef = inject(DialogRef);
    private readonly _backendService = inject(BackendService);
    private readonly _variableService = inject(VariablesService);
    private readonly _modalService = inject(ModalService);
    private readonly _ngZone = inject(NgZone);

    migrate(): void {
        const {
            currentWallet: { wallet_id },
        } = this._variableService;
        const params: ParamsCallRpc = { id: 0, jsonrpc: '2.0', method: 'sweep_bare_outs', params: {} };
        this._backendService.call_wallet_rpc([wallet_id, params], (status, response_data) => {
            this._ngZone.run(() => {
                if (response_data?.result) {
                    const data = response_data.result;

                    const dialogConfig: DialogConfig<SweepBareOuts> = {
                        maxWidth: '90vw',
                        width: '540px',
                        scrollStrategy: this._scrollStrategyNoop,
                        data,
                    };

                    this._dialog.open(SuccessSweepBareOutsComponent, dialogConfig);
                } else {
                    const message = response_data.error;
                    this._modalService.prepareModal('error', message);
                }

                this._dialogRef.close();
            });
        });
    }

    openZarcanumMigration(): void {
        this._backendService.openUrlInBrowser(ZARCANUM_MIGRATION);
    }
}
