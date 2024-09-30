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
import { SendMoneyFormParams } from '@api/models/send-money.model';
import { VariablesService } from '@parts/services/variables.service';
import { ZanoValidators } from '@parts/utils/zano-validators';
import { BigNumber } from 'bignumber.js';
import { AssetBalance, PriceInfo } from '@api/models/assets.model';

@Component({
    selector: 'app-send-modal',
    templateUrl: './send-modal.component.html',
    styleUrls: ['./send-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendModalComponent implements OnInit, OnDestroy {
    @HostBinding('class.modal-overlay') modalOverlay = true;

    @Input() sendMoneyParams: SendMoneyFormParams;

    @Input() priceInfo: PriceInfo;

    @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

    get amount(): string {
        const { amount, isAmountUSD, asset_id } = this.sendMoneyParams;
        const convertedAmountUSD = (): string => {
            let usd = 0;

            if (typeof this.priceInfo.data === 'object') {
                const { data } = this.priceInfo;
                usd = data.usd;
            }

            let decimal_point = 0;

            const { currentWallet } = this.variablesService;
            const asset: AssetBalance | undefined = currentWallet.getBalanceByAssetId(asset_id);

            if (asset) {
                const { asset_info } = asset;
                decimal_point = asset_info.decimal_point;
            }

            const convertedAmount = new BigNumber(amount || 0).dividedBy(usd || 0).decimalPlaces(decimal_point);

            return convertedAmount.toString();
        };

        return isAmountUSD ? convertedAmountUSD() : amount;
    }

    cdr = inject(ChangeDetectorRef);

    fb = inject(NonNullableFormBuilder);

    confirmForm = this.fb.group({
        password: this.fb.control(''),
        appPass: this.fb.control(''),
    });

    constructor(public variablesService: VariablesService, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'no-scroll');
        const { appPass } = this.variablesService;
        if (appPass) {
            this.confirmForm.controls.appPass.patchValue(appPass, {
                emitEvent: false,
            });
            this.confirmForm.setValidators([ZanoValidators.formMatch('password', 'appPass', 'passwordNotMatch')]);
            this.confirmForm.controls.password.setValidators([Validators.required]);
            this.confirmForm.updateValueAndValidity();
        }
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.body, 'no-scroll');
    }

    beforeSubmit(): void {
        if (this.confirmForm.invalid) {
            this.confirmForm.markAsTouched();
            this.confirmForm.updateValueAndValidity();
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
