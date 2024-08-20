import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-modal-container',
    template: `
        <div class="modal modal-container-wrapper">
            <button (click)="onClose()" class="close" type="button">
                <mat-icon svgIcon="zano-close"></mat-icon>
            </button>

            <div class="content mb-2" fxLayout="row" fxLayoutAlign="start center">
                <i
                    [class.error]="type === 'error'"
                    [class.info-icon]="type === 'info'"
                    [class.success]="type === 'success'"
                    class="icon min-width-4_4-rem min-height-4_4-rem mr-1"
                    fxFlex="0 0 auto"
                ></i>
                <div class="message-container">
                    <h3 class="title">{{ title }}</h3>
                    <p [innerHTML]="message" class="message"></p>
                </div>
            </div>

            <div class="controls" fxLayout="row" fxLayoutAlign="center center">
                <button #btn (click)="onClose()" class="primary max-w-19-rem w-100 big" type="button">
                    {{ 'MODALS.OK' | translate }}
                </button>
            </div>
        </div>
    `,
    styleUrls: ['./modal-container.component.scss'],
})
export class ModalContainerComponent implements OnInit, OnDestroy {
    @HostBinding('class.modal-overlay') modalOverlay = true;

    @HostBinding('class.modal-overlay-transparent') modalOverlayTransparent = false;

    public title: string;

    @Input() type: string;

    @Input() message: string;

    @Output() eventClose = new EventEmitter<void>();

    @ViewChild('btn', { static: true }) button: ElementRef;

    constructor(private translate: TranslateService, private renderer: Renderer2) {}

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
