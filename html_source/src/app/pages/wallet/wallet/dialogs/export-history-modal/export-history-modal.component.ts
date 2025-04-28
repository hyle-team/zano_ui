import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-export-history-modal',
    templateUrl: './export-history-modal.component.html',
    styleUrls: ['./export-history-modal.component.scss']
})
export class ExportHistoryModalComponent {
    posFilterIsOn: boolean = true;

    exportData = {
        wallet_id: 0,
        include_pos_transactions: false,
        path: 'C:\\some_file.txt',
        format: 'json'
    };

    exportFormats = [
        {
            format: 'json',
            formatName: 'JSON'
        },
        {
            format: 'text',
            formatName: 'Text'
        },
        {
            format: 'csv',
            formatName: 'CSV'
        }
    ];

    currentFormat: string = this.exportFormats[0].format;

    private backend: BackendService = inject(BackendService);

    public variablesService: VariablesService = inject(VariablesService);

    private translate: TranslateService = inject(TranslateService);

    private matDialogRef: MatDialogRef<ExportHistoryModalComponent> = inject(MatDialogRef);

    confirmExport(): void {
        this.exportData.format = `${this.currentFormat}`;
        this.exportData.wallet_id = this.variablesService.current_wallet.wallet_id;
        this.exportData.include_pos_transactions = this.posFilterIsOn;

        this.backend.saveFileDialog(
            this.translate.instant('EXPORT_HISTORY.SAVED_FILE'),
            `${this.exportData.format}`,
            this.variablesService.settings.default_path,
            (file_status, file_data) => {
                if (this.exportData.format === 'text') {
                    this.exportData.path = file_data.path + '.txt';
                } else {
                    this.exportData.path = file_data.path + `.${this.exportData.format}`;
                }
                if (file_status) {
                    this.backend.exportWalletHistory(JSON.stringify(this.exportData));
                    this.matDialogRef.close();
                }
            }
        );
    }
}
