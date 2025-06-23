import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputValidateModule } from '@parts/directives';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { intToMoney } from '@parts/functions/int-to-money';
import { VariablesService } from '@parts/services/variables.service';
import { ZANO_ASSET_INFO } from '@parts/data/assets';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MAXIMUM_VALUE } from '@parts/data/constants';

@Component({
    selector: 'zano-fee-field',
    standalone: true,
    imports: [CommonModule, FormsModule, InputValidateModule, IsVisibleControlErrorPipe, ReactiveFormsModule, TranslateModule],
    templateUrl: './fee-field.component.html',
    styleUrls: ['./fee-field.component.scss'],
})
export class FeeFieldComponent implements OnInit, OnDestroy {
    @Input() control_ref: FormControl<string>;

    private readonly _destroy$: Subject<void> = new Subject<void>();

    variables_service: VariablesService = inject(VariablesService);

    private readonly _translate_service: TranslateService = inject(TranslateService);

    error_messages: { [key: string]: string | undefined } = {
        fee: undefined,
    };

    ngOnInit(): void {
        merge(this.control_ref.statusChanges, this.control_ref.valueChanges)
            .pipe(takeUntil(this._destroy$))
            .subscribe((): void => this.updateFeeErrorMessage());
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    updateFeeErrorMessage(): void {
        const fee = this.control_ref;
        let message: string | undefined;

        switch (true) {
            case fee.hasError('less_min'): {
                const { default_fee } = this.variables_service;
                message = this._translate_service.instant('SEND.FORM_ERRORS.FEE_MINIMUM', { fee: default_fee });
                break;
            }
            case fee.hasError('required'): {
                message = 'SEND.FORM_ERRORS.FEE_REQUIRED';
                break;
            }
            case fee.hasError('greater_max'): {
                const { decimal_point } = ZANO_ASSET_INFO;
                const max = intToMoney(MAXIMUM_VALUE, decimal_point);
                message = this._translate_service.instant('ERRORS.MAX', { max });
                break;
            }
        }

        this.error_messages['fee'] = message;
    }
}
