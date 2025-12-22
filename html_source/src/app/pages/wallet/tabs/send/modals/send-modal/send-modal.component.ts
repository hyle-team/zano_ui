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
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { Destination } from '@api/models/custom-asstest.model';
import BigNumber from 'bignumber.js';

@Component({
    selector: 'app-send-modal',
    templateUrl: './send-modal.component.html',
    styleUrls: ['./send-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendModalComponent implements OnInit, OnDestroy {
    @HostBinding('class.modal-overlay') modalOverlay = true;

    @Input() transfer_params: TransferParams;

    @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

    cdr = inject(ChangeDetectorRef);

    fb = inject(NonNullableFormBuilder);

    form = this.fb.group({
        password: this.fb.control(''),
        appPass: this.fb.control(''),
    });

    totals: { asset_id: string; total_amount: BigNumber }[] = [];

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

        this.calculateTotals();
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.body, 'no-scroll');
    }

    calculateTotals(): void {
        if (this.transfer_params?.destinations) {
            const totalsMap = new Map<string, BigNumber>();
            for (const destination of this.transfer_params.destinations) {
                const { asset_id, amount } = destination;
                const currentTotal = totalsMap.get(asset_id) || new BigNumber(0);
                totalsMap.set(asset_id, currentTotal.plus(new BigNumber(amount)));
            }
            this.totals = Array.from(totalsMap.entries()).map(([asset_id, total_amount]) => ({
                asset_id,
                total_amount,
            }));
        }
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

    trackByFn(index: number, value: Destination): number | string {
        return value.asset_id ?? index;
    }

    protected readonly ZANO_ASSET_INFO = ZANO_ASSET_INFO;
}
