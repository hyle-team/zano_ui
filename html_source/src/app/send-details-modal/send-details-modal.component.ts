import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BackendService} from '../_helpers/services/backend.service';

@Component({
  selector: 'app-send-details-modal',
  templateUrl: './send-details-modal.component.html',
  styleUrls: ['./send-details-modal.component.scss']
})
export class SendDetailsModalComponent implements OnInit {

  @Output() onClose: EventEmitter<never> = new EventEmitter<never>();

  stateDetails = false;

  constructor(private _backendService: BackendService) {
  }

  ngOnInit() {
    /** TODO handle status and show successes steps and step pending */
    this._backendService.handleCurrentActionState((status) => {
      console.log(status);
    });
  }

  close() {
    this.onClose.emit();
  }

}
