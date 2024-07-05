import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AsyncCommandResults, BackendService } from '@api/services/backend.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-transaction-details-for-custom-assets',
    templateUrl: './transaction-details-for-custom-assets.component.html',
    styleUrls: ['./transaction-details-for-custom-assets.component.scss'],
})
export class TransactionDetailsForCustomAssetsComponent implements OnInit, OnDestroy {
    private _dialogRef: DialogRef = inject(DialogRef);

    private _backendService: BackendService = inject(BackendService);

    status: 'loading' | 'success' | 'error' = 'loading';

    data: { job_id: number } = inject(DIALOG_DATA);

    details: { key: string, value: any }[] = [];

    private _destroy$: Subject<void> = new Subject<void>();

    @ViewChild('elDetailsList', { static: true }) elDetailsList: ElementRef;

    isShowDetailsState: boolean = false;

    ngOnInit(): void {
        this._backendService.dispatchAsyncCallResult$.pipe(
            filter(Boolean),
            filter(({ job_id }: AsyncCommandResults) => this.data.job_id === job_id),
            takeUntil(this._destroy$)
        ).subscribe({
            next: ({ response }) => {
                if (response.error) {
                    this.status = 'error';
                    this.details = [{ key: 'Error', value: response.error.message }];
                } else {
                    this.status = 'success';
                    this.details = Object.entries(response.result).map(([key, value]) => ({ key, value }));
                }
            }
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    close(): void {
        this._dialogRef.close(this.status === 'success');
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
}
