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
} from '@zano-helpers/services/backend.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { VariablesService } from '@zano-helpers/services/variables.service';
import { filter, takeUntil } from 'rxjs/operators';

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

const failedStatuses: string[] = [
  StatusCurrentActionState.STATE_SEND_FAILED,
  StatusCurrentActionState.STATE_FAILED,
];

@Component({
  selector: 'app-send-details-modal',
  templateUrl: './send-details-modal.component.html',
  styleUrls: ['./send-details-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendDetailsModalComponent implements OnInit, OnDestroy {
  @HostBinding('class.modal-overlay') modalOverlay = true;

  /** Working id is traceable */
  @Input() job_id: number;

  @Output() eventClose = new EventEmitter<void>();

  @ViewChild('elDetailsList', { static: true }) elDetailsList: ElementRef;

  /** BehaviorSubject with ResponseAsyncTransfer */
  responseData$ = new BehaviorSubject<ResponseAsyncTransfer>(null);

  /** BehaviorSubject flag for stateDetails */
  stateDetails$ = new BehaviorSubject<boolean>(false);

  /** BehaviorSubject with CurrentActionState */
  currentActionState$ = new BehaviorSubject<CurrentActionState>(null);

  /** BehaviorSubject with CurrentActionState[] */
  currentActionStates$ = new BehaviorSubject<CurrentActionState[]>([]);

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private backendService: BackendService,
    private variablesService: VariablesService,
    private renderer: Renderer2
  ) {}

  get currentActionState(): CurrentActionState {
    return this.currentActionState$.value;
  }

  get currentActionStates(): CurrentActionState[] {
    return this.currentActionStates$.value;
  }

  /** True, if currentActionState.status = success */
  get isSentSuccess(): boolean {
    return (
      this.currentActionState &&
      this.currentActionState.status ===
        StatusCurrentActionState.STATE_SENT_SUCCESS
    );
  }

  /** True, if currentActionState.status = failed */
  get isSentFailed(): boolean {
    return (
      this.currentActionState &&
      this.currentActionState.status ===
        StatusCurrentActionState.STATE_SEND_FAILED
    );
  }

  /** True, responseData$ or currentActionStates$ not empty */
  get isDetailsNotEmpty(): boolean {
    return !!(
      this.responseData$.value || this.currentActionStates$.value.length > 0
    );
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-scroll');
    const {
      currentWallet: { wallet_id },
      settings: { appUseTor },
    } = this.variablesService;

    if (appUseTor) {
      /** Listening handleCurrentActionState */
      this.backendService.handleCurrentActionState$
        .pipe(takeUntil(this.destroy$))
        .subscribe((currentActionState: CurrentActionState) => {
          this.currentActionState$.next(currentActionState);
          this.currentActionStates$.next([
            ...this.currentActionStates,
            currentActionState,
          ]);
        });
    } else {
      const actionState: CurrentActionState = {
        status: StatusCurrentActionState.STATE_INITIALIZING,
        wallet_id,
      };
      this.currentActionState$.next(actionState);
      this.currentActionStates$.next([
        ...this.currentActionStates,
        actionState,
      ]);
    }

    /** Listening dispatchAsyncCallResult */
    this.backendService.dispatchAsyncCallResult$
      .pipe(
        filter(
          ({ job_id, response }: AsyncCommandResults) =>
            this.job_id === job_id && !!response
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({ response }: AsyncCommandResults) => {
        const {
          response_data: { success },
        } = response;
        if (!appUseTor || !success) {
          const actionState: CurrentActionState = {
            status: success
              ? StatusCurrentActionState.STATE_SENT_SUCCESS
              : StatusCurrentActionState.STATE_SEND_FAILED,
            wallet_id,
          };
          this.currentActionState$.next(actionState);
          this.currentActionStates$.next([
            ...this.currentActionStates,
            actionState,
          ]);
        }

        this.responseData$.next(response);
      });
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Show/Hide details transaction */
  toggleDetails(): void {
    this.stateDetails$.next(!this.stateDetails$.value);
    setTimeout(() => this.scrollToBottomDetailsList(), 100);
  }

  /** identification item by *ngFor */
  trackBy(index: number): number {
    return index;
  }

  /** True, if status success */
  isSuccess(action: CurrentActionState): boolean {
    return successfulStatuses.includes(action && action.status);
  }

  /** True, if status failed */
  isFailed(action: CurrentActionState): boolean {
    return failedStatuses.includes(action && action.status);
  }

  /** Scroll elDetailsWrapper to bottom */
  private scrollToBottomDetailsList(): void {
    if (this.elDetailsList) {
      const { nativeElement } = this.elDetailsList;
      nativeElement.scrollTop = nativeElement.scrollHeight;
    }
  }
}
