import { Pipe, PipeTransform } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { moneyToInt } from '@parts/functions/money-to-int';

@Pipe({
    name: 'moneyToInt'
})
export class MoneyToIntPipe implements PipeTransform {
    constructor(private variablesService: VariablesService) {}

    transform(value: any): any {
        return moneyToInt(value, this.variablesService.decimal_point);
    }
}
