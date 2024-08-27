import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
} from '@angular/core';
import {
    AsyncCommandResults,
    BackendService,
    CurrentActionState,
    ResponseAsyncTransfer,
    StatusCurrentActionState,
} from '@api/services/backend.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { VariablesService } from '@parts/services/variables.service';
import { filter, takeUntil } from 'rxjs/operators';
import { BLOCK_EXPLORER_TN_TX_URL_PREFIX, BLOCK_EXPLORER_TX_URL_PREFIX } from '@parts/data/constants';

const successfulStatuses: string[] = [
    StatusCurrentActionState.STATE_SENDING,
    StatusCurrentActionState.STATE_SENT_SUCCESS,
    StatusCurrentActionState.STATE_INITIALIZING,
    StatusCurrentActionState.STATE_DOWNLOADING_CONSENSUS,
    StatusCurrentActionState.STATE_MAKING_TUNNEL_A,
    StatusCurrentActionState.STATE_MAKING_TUNNEL_B,
    StatusCurrentActionState.STATE_CREATING_STREAM,
    StatusCurrentActionState.STATE_SUCCESS,
];

const failedStatuses: string[] = [StatusCurrentActionState.STATE_SEND_FAILED, StatusCurrentActionState.STATE_FAILED];

@Component({
    selector: 'app-send-details-modal',
    templateUrl: './send-details-modal.component.html',
    styleUrls: ['./send-details-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendDetailsModalComponent implements OnInit, OnDestroy {
    @HostBinding('class.modal-overlay') modalOverlay = true;

    @Input() job_id: number;

    @Output() eventClose = new EventEmitter<boolean>();

    @ViewChild('elDetailsList', { static: true }) elDetailsList: ElementRef;

    responseData$ = new BehaviorSubject<ResponseAsyncTransfer>(null);

    stateDetails$ = new BehaviorSubject<boolean>(false);

    currentActionState$ = new BehaviorSubject<CurrentActionState>(null);

    currentActionStates$ = new BehaviorSubject<CurrentActionState[]>([]);

    success = false;

    private destroy$: Subject<void> = new Subject<void>();

    constructor(private backendService: BackendService, private variablesService: VariablesService, private renderer: Renderer2) {}

    get currentActionState(): CurrentActionState {
        return this.currentActionState$.value;
    }

    get currentActionStates(): CurrentActionState[] {
        return this.currentActionStates$.value;
    }

    get isSentSuccess(): boolean {
        return this.currentActionState && this.currentActionState.status === StatusCurrentActionState.STATE_SENT_SUCCESS;
    }

    get isSentFailed(): boolean {
        return this.currentActionState && this.currentActionState.status === StatusCurrentActionState.STATE_SEND_FAILED;
    }

    get isDetailsNotEmpty(): boolean {
        return !!(this.responseData$.value || this.currentActionStates$.value.length > 0);
    }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'no-scroll');
        const {
            currentWallet: { wallet_id },
            settings: { appUseTor },
        } = this.variablesService;

        if (appUseTor) {
            this.backendService.handleCurrentActionState$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe({
                next: (currentActionState: CurrentActionState) => {
                    this.currentActionState$.next(currentActionState);
                    this.currentActionStates$.next([...this.currentActionStates, currentActionState]);
                },
            });
        } else {
            const actionState: CurrentActionState = {
                status: StatusCurrentActionState.STATE_INITIALIZING,
                wallet_id,
            };
            this.currentActionState$.next(actionState);
            this.currentActionStates$.next([...this.currentActionStates, actionState]);
        }

        this.backendService.dispatchAsyncCallResult$
            .pipe(
                filter(Boolean),
                filter(({ job_id, response }: AsyncCommandResults<ResponseAsyncTransfer>) => this.job_id === job_id && !!response),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: ({ response }: AsyncCommandResults<ResponseAsyncTransfer>) => {
                    const { response_data } = response;
                    const success = response_data?.success ?? false;
                    this.success = success;

                    const actionState: CurrentActionState = {
                        status: success ? StatusCurrentActionState.STATE_SENT_SUCCESS : StatusCurrentActionState.STATE_SEND_FAILED,
                        wallet_id,
                    };
                    this.currentActionState$.next(actionState);
                    this.currentActionStates$.next([...this.currentActionStates, actionState]);

                    this.responseData$.next(response);
                },
            });
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.body, 'no-scroll');
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleDetails(): void {
        this.stateDetails$.next(!this.stateDetails$.value);
        setTimeout(() => this.scrollToBottomDetailsList(), 100);
    }

    trackBy(index: number): number {
        return index;
    }

    isSuccess(action: CurrentActionState): boolean {
        return successfulStatuses.includes(action && action.status);
    }

    isFailed(action: CurrentActionState): boolean {
        return failedStatuses.includes(action && action.status);
    }

    private scrollToBottomDetailsList(): void {
        if (this.elDetailsList) {
            const { nativeElement } = this.elDetailsList;
            nativeElement.scrollTop = nativeElement.scrollHeight;
        }
    }

    openInBrowser(hash: string): void {
        this.backendService.openUrlInBrowser(
            (this.variablesService.testnet ? BLOCK_EXPLORER_TN_TX_URL_PREFIX : BLOCK_EXPLORER_TX_URL_PREFIX) + hash
        );
    }
}
