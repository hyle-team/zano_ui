import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '@api/models/transaction.model';
import { TranslateModule } from '@ngx-translate/core';
import { HistoryTypeMessagesPipeModule, ShortStringPipe } from '@parts/pipes';
import { TooltipModule } from '@parts/directives';
import { VariablesService } from '@parts/services/variables.service';

@Component({
    selector: 'zano-cell-address',
    standalone: true,
    imports: [CommonModule, TranslateModule, ShortStringPipe, TooltipModule, HistoryTypeMessagesPipeModule],
    templateUrl: './cell-address.component.html',
    styleUrls: ['./cell-address.component.scss'],
})
export class CellAddressComponent {
    @Input()
    transaction: Transaction;

    variablesService = inject(VariablesService);

    get isShowMessage() {
        const { tx_type } = this.transaction;
        return tx_type !== 0;
    }

    get isShowAddressOrAlias() {
        const { remote_addresses = [], remote_aliases = [], tx_type } = this.transaction;
        return [...remote_addresses, ...remote_aliases].length && tx_type === 0;
    }

    get isShowHidden() {
        const { remote_addresses = [], remote_aliases = [], tx_type } = this.transaction;

        return ![...remote_addresses, ...remote_aliases].length && tx_type === 0;
    }

    get items() {
        let items: { type: 'address' | 'alias'; value: string }[] = [];
        const { remote_addresses = [], remote_aliases = [] } = this.transaction;

        remote_addresses.forEach((address, index) => {
            const alias = remote_aliases[index];
            if (alias) {
                items.push({ type: 'alias', value: alias });
            } else {
                items.push({ type: 'address', value: address });
            }
        });

        return items;
    }

    get firstItem() {
        return this.items[0];
    }

    get copyText() {
        if (!this.firstItem) return '';

        const { type, value } = this.firstItem;

        switch (type) {
            case 'address': {
                return value;
            }
            case 'alias': {
                return `@${ value }`;
            }
            default: {
                return value;
            }
        }

    }
}
