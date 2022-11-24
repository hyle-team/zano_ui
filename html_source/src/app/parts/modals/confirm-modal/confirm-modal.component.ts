import {
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

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  @HostBinding('class.modal-overlay') modalOverlay = true;

  @Input() title: string;

  @Input() message: string;

  @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('btn', { static: true }) button: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-scroll');
    this.button.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  onSubmit(): void {
    this.confirmed.emit(true);
  }

  close(): void {
    this.confirmed.emit(false);
  }
}
