import { Component, Input } from '@angular/core';
import { Transaction } from '@api/models/transaction.model';
import { VariablesService } from '../services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { BLOCK_EXPLORER_TN_TX_URL_PREFIX, BLOCK_EXPLORER_TX_URL_PREFIX } from '../data/constants';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from '@parts/directives';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-transaction-details',
    template: `
        <table role="table" class="zano-table">
            <tbody>
                <tr role="row">
                    <td>{{ 'HISTORY.DETAILS.ID' | translate }}</td>
                    <td
                        colspan="2"
                        (click)="openInBrowser($event, transaction.tx_hash)"
                        (keydown.space)="openInBrowser($event, transaction.tx_hash)"
                        (keydown.enter)="openInBrowser($event, transaction.tx_hash)"
                        (contextmenu)="variablesService.onContextMenuOnlyCopy($event, transaction.tx_hash)"
                        class="color-primary cursor-pointer"
                        tabindex="0"
                        role="button"
                    >
                        {{ transaction.tx_hash }}
                    </td>
                    <td>{{ 'HISTORY.DETAILS.SIZE' | translate }}</td>
                    <td>
                        {{ 'HISTORY.DETAILS.SIZE_VALUE' | translate : { value: transaction.tx_blob_size } }}
                    </td>
                </tr>
                <tr role="row">
                    <td>{{ 'Asset ID' | translate }}</td>
                    <td colspan="2" class="color-primary cursor-pointer">
                        <ng-container *ngFor="let asset_id of getAllUniqAssetId(transaction)">
                            <p class="text-ellipsis" (contextmenu)="variablesService.onContextMenuOnlyCopy($event, asset_id)">
                                {{ asset_id }}
                            </p>
                        </ng-container>
                    </td>
                    <td>{{ 'HISTORY.DETAILS.CONFIRMATION' | translate }}</td>
                    <td>
                        {{ transaction.height === 0 ? 0 : variablesService.height_app - transaction.height }}
                    </td>
                </tr>
                <tr role="row">
                    <td>{{ 'HISTORY.DETAILS.HEIGHT' | translate }}</td>
                    <td colspan="2">{{ transaction.height }}</td>
                    <td colspan="2"></td>
                </tr>
                <tr role="row">
                    <td>{{ 'HISTORY.DETAILS.PAYMENT_ID' | translate }}</td>
                    <td colspan="4" [matTooltip]="transaction.payment_id" matTooltipShowDelay="1500" matTooltipPosition="above">
                        {{ transaction.payment_id }}
                    </td>
                </tr>
                <tr role="row">
                    <td>{{ 'HISTORY.DETAILS.COMMENT' | translate }}</td>
                    <td
                        colspan="4"
                        tabindex="0"
                        role="textbox"
                        aria-readonly="true"
                        (contextmenu)="variablesService.onContextMenuOnlyCopy($event, transaction.comment)"
                        [matTooltip]="transaction.comment"
                        matTooltipShowDelay="1500"
                        matTooltipPosition="above"
                    >
                        {{ transaction.comment }}
                    </td>
                </tr>
            </tbody>
        </table>
    `,
    styles: [
        `
            :host {
                display: block;
                padding: 2rem 0;
            }
            table tbody tr {
                background: none;
            }

            table tbody tr td {
                padding: 1rem 2rem;
            }
        `,
    ],
    standalone: true,
    imports: [CommonModule, TranslateModule, TooltipDirective, MatTooltipModule],
})
export class TransactionDetailsComponent {
    @Input() transaction: Transaction;

    constructor(public variablesService: VariablesService, private backendService: BackendService) {}

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
}
