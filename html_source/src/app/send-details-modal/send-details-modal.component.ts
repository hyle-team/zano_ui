import { ChangeDetectionStrategy, Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { BackendService, CurrentActionState, StatusCurrentActionState } from '../_helpers/services/backend.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-send-details-modal',
  templateUrl: './send-details-modal.component.html',
  styleUrls: ['./send-details-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendDetailsModalComponent implements OnInit {
  @Output() close: EventEmitter<never> = new EventEmitter<never>();

  stateDetails$ = new BehaviorSubject<boolean>(false);

  currentActionState$ = new BehaviorSubject<CurrentActionState>(null);

  get currentActionState(): CurrentActionState {
    return this.currentActionState$.value;
  }

  successStatuses: string[] = [
    StatusCurrentActionState.STATE_SENDING,
    StatusCurrentActionState.STATE_SENT_SUCCESS,
    StatusCurrentActionState.STATE_INITIALIZING,
    StatusCurrentActionState.STATE_DOWNLOADING_CONSENSUS,
    StatusCurrentActionState.STATE_MAKING_TUNNEL_A,
    StatusCurrentActionState.STATE_MAKING_TUNNEL_B,
    StatusCurrentActionState.STATE_CREATING_STREAM,
    StatusCurrentActionState.STATE_SUCCESS
  ];

  failedStatuses: string[] = [StatusCurrentActionState.STATE_SEND_FAILED, StatusCurrentActionState.STATE_FAILED];

  actionsList$ = new BehaviorSubject<CurrentActionState[]>([]);

  get actionsList(): CurrentActionState[] {
    return this.actionsList$.value;
  }

  get isSentSuccess(): boolean {
    return this.currentActionState && this.currentActionState.status === StatusCurrentActionState.STATE_SENT_SUCCESS;
  }

  get isSentFailed(): boolean {
    return this.currentActionState && this.currentActionState.status === StatusCurrentActionState.STATE_SEND_FAILED;
  }

  constructor(private _backendService: BackendService, private ngZone: NgZone) {
  }

  ngOnInit() {
    this._backendService.handleCurrentActionState((currentActionState: CurrentActionState) => {
      this.ngZone.run(() => {
        this.currentActionState$.next(currentActionState);
        this.actionsList$.next([...this.actionsList, currentActionState]);
      });
    });
  }

  toggleDetails() {
    this.stateDetails$.next(!this.stateDetails$.value);
  }

  trackBy(index: number): number {
    return index;
  }

  isSuccess(action: CurrentActionState): boolean {
    return this.successStatuses.includes(action && action.status);
  }

  isFailed(action: CurrentActionState): boolean {
    return this.failedStatuses.includes(action && action.status);
  }

}
