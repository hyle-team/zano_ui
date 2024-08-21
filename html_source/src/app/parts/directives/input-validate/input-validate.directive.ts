import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { BigNumber } from 'bignumber.js';

@Directive({
    selector: '[appInputValidate]',
})
export class InputValidateDirective {
    constructor(private el: ElementRef, private variablesService: VariablesService) {}

    @Input('appInputValidate')
    public type: 'money' | 'integer';

    private _decimalPoint: number = this.variablesService.decimal_point;

    @Input('decimalPoint')
    public set decimalPoint(value: number) {
        this._decimalPoint = value;
        this._formatValue();
    }

    @HostListener('input', ['$event'])
    handleInput(): void {
        this._formatValue();
    }

    private _formatValue(): void {
        switch (this.type) {
            case 'money': {
                return this._money();
            }
            case 'integer': {
                return this._integer();
            }
        }
    }

    private _prepareToMoney(value: string): string {
        let currentValue = value;
        // eslint-disable-next-line
        const OnlyD = /[^\d\.]/g;
        const _has_error = currentValue.match(OnlyD);
        if (_has_error && _has_error.length) {
            currentValue = currentValue.replace(',', '.').replace(OnlyD, '');
        }
        const _double_separator = currentValue.match(/\./g);
        if (_double_separator && _double_separator.length > 1) {
            currentValue = currentValue.substr(0, currentValue.lastIndexOf('.'));
        }

        if (currentValue.length > 1 && currentValue.indexOf('.') !== 1 && currentValue.indexOf('0') === 0) {
            currentValue = new BigNumber(currentValue).toString();
        }

        if (currentValue.indexOf('.') === 0) {
            currentValue = '0' + currentValue;
        }
        const _zero_fill = currentValue.split('.');
        if (_zero_fill[0].length > 20) {
            _zero_fill[0] = _zero_fill[0].substr(0, 20);
        }

        if (1 in _zero_fill && _zero_fill[1].length) {
            _zero_fill[1] = _zero_fill[1].substr(0, this._decimalPoint);
        }
        return this._decimalPoint ? _zero_fill.join('.') : _zero_fill[0];
    }

    private _money(): void {
        const value: string = this.el.nativeElement.value;
        const originalValue: string = value;
        const preparedValue: string = this._prepareToMoney(value);

        if (preparedValue !== originalValue) {
            this._setValue(preparedValue);
        }
    }

    private _integer(): void {
        let preparedValue = this.el.nativeElement.value;
        const originalValue = preparedValue;
        const OnlyD = /\D/g;
        const _has_error = preparedValue.match(OnlyD);
        if (_has_error && _has_error.length) {
            preparedValue = preparedValue.replace(OnlyD, '');
        }
        if (preparedValue !== originalValue) {
            this._setValue(preparedValue);
        }
    }

    private _setValue(value: string): void {
        this.el.nativeElement.value = value;
        const cursorPosition = this.el.nativeElement.selectionEnd;
        this.el.nativeElement.setSelectionRange(cursorPosition, cursorPosition);
        this.el.nativeElement.dispatchEvent(new Event('input'));
    }
}
