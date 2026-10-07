import { Component, inject, NgZone, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';

interface MakeSnapshotResult {
    status: string;
    file: string;
}

@Component({
    selector: 'app-make-snapshot',
    templateUrl: './make-snapshot.component.html',
    styleUrls: ['./make-snapshot.component.scss'],
})
export class MakeSnapshotComponent implements OnDestroy {
    agreed = false;

    processing = false;

    done = false;

    error = '';

    resultFile = '';

    private readonly _matDialogRef: MatDialogRef<MakeSnapshotComponent> = inject(MatDialogRef);

    private readonly _backendService: BackendService = inject(BackendService);

    private readonly _variablesService: VariablesService = inject(VariablesService);

    private readonly _ngZone: NgZone = inject(NgZone);

    private _runningWalletId: number | null = null;

    // snapshot-scan progress %, pushed to current_wallet.progress via the wallet_sync_progress event
    get progress(): number {
        return this._variablesService.current_wallet?.progress ?? 0;
    }

    start(): void {
        if (!this.agreed || this.processing) {
            return;
        }
        const { wallet_id, address, path } = this._variablesService.current_wallet;
        // default to the wallet file's own directory
        const sep = Math.max((path || '').lastIndexOf('/'), (path || '').lastIndexOf('\\'));
        const defaultPath = (sep >= 0 ? path.substring(0, sep + 1) : '') + address + '.snapshot-json';
        this._backendService.saveFileDialog(
            'Choose snapshot location',
            '*.snapshot-json',
            defaultPath,
            (file_status: boolean, file_data: { path?: string }) => {
                this._ngZone.run(() => {
                    if (!file_status || !file_data || !file_data.path) {
                        return;
                    }
                    this.processing = true;
                    this.error = '';
                    this._runningWalletId = wallet_id;
                    this._backendService.makeHf6Snapshot(wallet_id, file_data.path, (response: MakeSnapshotResult) => {
                        this._ngZone.run(() => {
                            this.processing = false;
                            this._runningWalletId = null;
                            this._restoreWalletSyncState(wallet_id);
                            if (response && response.status === 'OK') {
                                this.done = true;
                                this.resultFile = response.file;
                            } else {
                                this.error = (response && response.status) || 'FAILED';
                            }
                        });
                    });
                });
            }
        );
    }

    cancel(): void {
        // just close; any close path (this button, backdrop click, ESC) cancels in ngOnDestroy
        this._matDialogRef.close();
    }

    close(): void {
        this._matDialogRef.close();
    }

    ngOnDestroy(): void {
        if (this._runningWalletId !== null) {
            this._backendService.cancelHf6Snapshot(this._runningWalletId);
            this._restoreWalletSyncState(this._runningWalletId);
        }
    }

    // The snapshot scan emits on_sync_progress, which app.component treats as a real sync cycle
    // (toggling wallet.loaded, sync_started, sync_wallets). Those stay set if no terminal 100 arrives
    // (cancel/error), freezing the wallet UI. Restore the already-synced state explicitly.
    private _restoreWalletSyncState(walletId: number): void {
        const wallet = this._variablesService.getWallet(walletId);
        if (wallet) {
            wallet.loaded = true;
            wallet.progress = 100;
        }
        this._variablesService.sync_started = false;
        if (this._variablesService.sync_wallets) {
            this._variablesService.sync_wallets[walletId] = false;
        }
    }
}
