import { Pipe, PipeTransform } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { intToMoney } from '@parts/functions/int-to-money';
import { BigNumber } from 'bignumber.js';

@Pipe({
    name: 'intToMoney',
})
export class IntToMoneyPipe implements PipeTransform {
    constructor(private variablesService: VariablesService) {}

    transform(value: number | string | BigNumber, decimal_point = this.variablesService.digits): any {
        return intToMoney(value, decimal_point);
    }
}
