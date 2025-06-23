import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { VariablesService } from '@parts/services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { Subject } from 'rxjs';
import { BLOCK_EXPLORER_TN_TX_URL_PREFIX, BLOCK_EXPLORER_TX_URL_PREFIX } from '@parts/data/constants';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { CopyButtonComponent } from '@parts/components/copy-button.component';

@Component({
    selector: 'app-swap-details',
    templateUrl: './swap-details.component.html',
    styleUrls: ['./swap-details.component.scss'],
    standalone: true,
    imports: [CommonModule, MatDialogModule, TranslateModule, FlexModule, MatIconModule, FlexLayoutModule, CopyButtonComponent],
})
export class SwapDetailsComponent implements OnInit, OnDestroy {
    public status: 'loading' | 'success' | 'error' = 'loading';

    // public data: { job_id: number } = inject(MAT_DIALOG_DATA);

    public data: { response: any } = inject(MAT_DIALOG_DATA);

    public details: { result_tx_id: string };

    public error: any;

    @ViewChild('elDetailsList', { static: true }) elDetailsList: ElementRef;

    public isShowDetailsState = false;

    public variablesService: VariablesService = inject(VariablesService);

    private _backendService: BackendService = inject(BackendService);

    private _destroy$: Subject<void> = new Subject<void>();

    ngOnInit(): void {
        // this._backendService.dispatchAsyncCallResult$
        //     .pipe(
        //         filter(Boolean),
        //         filter(({ job_id }: AsyncCommandResults) => this.data.job_id === job_id),
        //         takeUntil(this._destroy$)
        //     )
        //     .subscribe({
        //         next: ({ response }) => {
        //             if (response.error) {
        //                 this.status = 'error';
        //                 this.error = response.error;
        //             } else {
        //                 this.status = 'success';
        //                 this.details = response.result;
        //             }
        //         },
        //     });

        const { response } = this.data;
        if (response.error) {
            this.status = 'error';
            this.error = response.error;
        } else {
            this.status = 'success';
            this.details = response.result;
        }
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
