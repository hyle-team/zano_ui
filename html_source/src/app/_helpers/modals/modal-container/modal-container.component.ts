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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
})
export class ModalContainerComponent implements OnInit, OnDestroy {
  @HostBinding('class.modal-overlay') modalOverlay = true;

  public title: string;

  @Input() type: string;

  @Input() message: string;

  @Output() eventClose = new EventEmitter<void>();

  @ViewChild('btn', { static: true }) button: ElementRef;

  constructor(
    private translate: TranslateService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-scroll');
    this.button.nativeElement.focus();
    switch (this.type) {
      case 'error':
        this.title = this.translate.instant('MODALS.ERROR');
        break;
      case 'success':
        this.title = this.translate.instant('MODALS.SUCCESS');
        break;
      case 'info':
        this.title = this.translate.instant('MODALS.INFO');
        break;
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  onClose(): void {
    this.eventClose.emit();
  }
}
