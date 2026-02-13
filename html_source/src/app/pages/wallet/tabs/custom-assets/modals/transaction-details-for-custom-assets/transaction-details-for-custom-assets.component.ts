import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AsyncCommandResults, BackendService } from '@api/services/backend.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BLOCK_EXPLORER_TN_TX_URL_PREFIX, BLOCK_EXPLORER_TX_URL_PREFIX } from '@parts/data/constants';
import { VariablesService } from '@parts/services/variables.service';

@Component({
    selector: 'app-transaction-details-for-custom-assets',
    templateUrl: './transaction-details-for-custom-assets.component.html',
    styleUrls: ['./transaction-details-for-custom-assets.component.scss'],
})
export class TransactionDetailsForCustomAssetsComponent implements OnInit, OnDestroy {
    public status: 'loading' | 'success' | 'error' = 'loading';

    public data: { job_id: number } = inject(MAT_DIALOG_DATA);

    public details: { new_asset_id: string; tx_id: string };

    public error: any;

    @ViewChild('elDetailsList', { static: true }) elDetailsList: ElementRef;

    public isShowDetailsState = false;

    public variablesService: VariablesService = inject(VariablesService);

    private _backendService: BackendService = inject(BackendService);

    private _destroy$: Subject<void> = new Subject<void>();

    ngOnInit(): void {
        this._backendService.dispatchAsyncCallResult$
            .pipe(
                filter(Boolean),
                filter(({ job_id }: AsyncCommandResults) => this.data.job_id === job_id),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: ({ response }) => {
                    if (response.error) {
                        this.status = 'error';
                        this.error = response.error;
                    } else {
                        this.status = 'success';
                        this.details = response.result;
                    }
                },
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    toggleDetails(): void {
        this.isShowDetailsState = !this.isShowDetailsState;
        setTimeout(() => this.scrollToBottomDetailsList(), 100);
    }

    private scrollToBottomDetailsList(): void {
        if (this.elDetailsList) {
            const { nativeElement } = this.elDetailsList;
            nativeElement.scrollTop = nativeElement.scrollHeight;
        }
    }

    openInBrowser(hash: string): void {
        this._backendService.openUrlInBrowser(
            (this.variablesService.testnet ? BLOCK_EXPLORER_TN_TX_URL_PREFIX : BLOCK_EXPLORER_TX_URL_PREFIX) + hash
        );
    }
}
