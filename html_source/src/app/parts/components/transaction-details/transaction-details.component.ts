import { Component, Input } from '@angular/core';
import { SubtransferByPID, Transaction } from '@api/models/transaction.model';
import { VariablesService } from '../../services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { BLOCK_EXPLORER_TN_TX_URL_PREFIX, BLOCK_EXPLORER_TX_URL_PREFIX } from '../../data/constants';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssetInfo } from '@api/models/assets.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AssetDetailsComponent } from '@parts/modals/asset-details/asset-details.component';

@Component({
    selector: 'app-transaction-details',
    templateUrl: './transaction-details.component.html',
    styleUrls: ['./transaction-details.component.scss'],
    imports: [CommonModule, TranslateModule, MatTooltipModule],
    standalone: true,
})
export class TransactionDetailsComponent {
    @Input() transaction: Transaction;

    constructor(
        public variablesService: VariablesService,
        private backendService: BackendService,
        private readonly _matDialog: MatDialog
    ) {}

    trackBySubtransferByPid(index: number, { payment_id }: SubtransferByPID): string | number {
        return payment_id || index;
    }

    getAllUniqAssetId(transaction: Transaction): Set<string> {
        const { employed_entries } = transaction;
        const { receive = [], spent = [] } = employed_entries;
        return new Set([...receive, ...spent].map(({ asset_id }) => asset_id));
    }

    openInBrowser(event: Event, hash: string): void {
        event.preventDefault();
        event.stopPropagation();
        this.backendService.openUrlInBrowser(
            (this.variablesService.testnet ? BLOCK_EXPLORER_TN_TX_URL_PREFIX : BLOCK_EXPLORER_TX_URL_PREFIX) + hash
        );
    }

    assetDetails(asset_id: string): void {
        const asset_info: Partial<AssetInfo> = { asset_id };
        const config: MatDialogConfig = {
            data: {
                asset_info,
            },
        };
        this._matDialog.open(AssetDetailsComponent, config);
    }
}
