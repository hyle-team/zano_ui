import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
} from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { TransferParams } from '@api/models/transfer.model';
import { VariablesService } from '@parts/services/variables.service';
import { ZanoValidators } from '@parts/utils/zano-validators';
import { PriceInfo } from '@api/models/assets.model';

@Component({
    selector: 'app-send-modal',
    templateUrl: './send-modal.component.html',
    styleUrls: ['./send-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendModalComponent implements OnInit, OnDestroy {
    @HostBinding('class.modal-overlay') modalOverlay = true;

    @Input() transfer_params: TransferParams;

    @Input() price_info: PriceInfo;

    @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

    cdr = inject(ChangeDetectorRef);

    fb = inject(NonNullableFormBuilder);

    form = this.fb.group({
        password: this.fb.control(''),
        appPass: this.fb.control(''),
    });

    constructor(public variablesService: VariablesService, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'no-scroll');
        const { appPass } = this.variablesService;
        if (appPass) {
            this.form.controls.appPass.patchValue(appPass, {
                emitEvent: false,
            });
            this.form.setValidators([ZanoValidators.formMatch('password', 'appPass', 'passwordNotMatch')]);
            this.form.controls.password.setValidators([Validators.required]);
            this.form.updateValueAndValidity();
        }
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.body, 'no-scroll');
    }

    beforeSubmit(): void {
        if (this.form.invalid) {
            this.form.markAsTouched();
            this.form.updateValueAndValidity();
            this.cdr.detectChanges();
            return;
        }

        this.submit();
    }

    submit(): void {
        this.confirmed.emit(true);
    }

    onClose(): void {
        this.confirmed.emit(false);
    }
}
