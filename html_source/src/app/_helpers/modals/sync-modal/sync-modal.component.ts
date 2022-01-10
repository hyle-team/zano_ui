import { Component, EventEmitter, OnInit, Output, } from '@angular/core';

@Component({
  selector: 'app-sync-modal',
  templateUrl: './sync-modal.component.html',
  styleUrls: ['./sync-modal.component.scss']
})
export class SyncModalComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  close() {
    this.closeModal.emit(true);
  }
  ngOnInit() {
  }

}
