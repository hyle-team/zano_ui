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

    // snapshot-scan progress %, pushed to current_wallet.progress via the wallet_sync_progress event
    get progress(): number {
        return this._variablesService.current_wallet?.progress ?? 0;
    }

    start(): void {
        if (!this.agreed || this.processing) {
            return;
        }
        const { wallet_id, address } = this._variablesService.current_wallet;
        // pick the location first; the filename is fixed to <address>.snapshot-json. Cancel -> stay on the disclaimer.
        this._backendService.saveFileDialog(
            'Choose snapshot location',
            '*.snapshot-json',
            address + '.snapshot-json',
            (file_status: boolean, file_data: { path?: string }) => {
                this._ngZone.run(() => {
                    if (!file_status || !file_data || !file_data.path) {
                        return;
                    }
                    this.processing = true;
                    this.error = '';
                    this._backendService.makeHf6Snapshot(wallet_id, file_data.path, (response: MakeSnapshotResult) => {
                        this._ngZone.run(() => {
                            this.processing = false;
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
        // if the dialog is dismissed while a snapshot is still running, stop the backend work too
        if (this.processing) {
            const { wallet_id } = this._variablesService.current_wallet;
            this._backendService.cancelHf6Snapshot(wallet_id);
        }
    }
}
