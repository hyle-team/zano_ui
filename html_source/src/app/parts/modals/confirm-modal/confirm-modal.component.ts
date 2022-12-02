import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

export interface ConfirmModalData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  title: string;

  message: string;

  @ViewChild('buttonSubmit', { static: true }) buttonSubmit: ElementRef;

  constructor(
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) { title, message }: ConfirmModalData
  ) {
    this.title = title;
    this.message = message;
  }

  ngOnInit(): void {
    this.buttonSubmit.nativeElement.focus();
  }

  submit(): void {
    this.dialogRef.close(true);
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
