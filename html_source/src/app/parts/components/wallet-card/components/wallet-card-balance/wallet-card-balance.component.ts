import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wallet, WalletSettings } from '@api/models/wallet.model';
import { DisablePriceFetchDirective, TooltipDirective } from '@parts/directives';
import { VisibilityBalanceDirective } from '@parts/directives/visibility-balance.directive';
import { BigNumber } from 'bignumber.js';
import { LOCKED_BALANCE_HELP_PAGE } from '@parts/data/constants';
import { IntToMoneyPipe, IntToMoneyPipeModule } from '@parts/pipes';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { MatIconModule } from '@angular/material/icon';
import { intToMoney } from '@parts/functions/int-to-money';
import { isFiatCurrency } from '@parts/data/currencies';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AssetBalance } from '@api/models/assets.model';
import { CurrentPriceForAssets } from '@api/models/api-zano.models';

@Component({
    selector: 'zano-wallet-card-balance',
    standalone: true,
    imports: [CommonModule, DisablePriceFetchDirective, VisibilityBalanceDirective, TooltipDirective, MatIconModule, IntToMoneyPipeModule],
    templateUrl: './wallet-card-balance.component.html',
    styleUrls: ['./wallet-card-balance.component.scss'],
})
export class WalletCardBalanceComponent implements OnChanges {
    @Input() wallet: Wallet;

    totalBalance$: Observable<{ value: string; currency: string }>;

    tooltip$: Observable<HTMLDivElement>;

    constructor(
        private intToMoneyPipe: IntToMoneyPipe,
        private translate: TranslateService,
        public variablesService: VariablesService,
        private backend: BackendService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.wallet && changes.wallet.currentValue) {
            this.initObservables();
        }
    }

    changeBalanceDisplayMode(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.wallet.settings.balanceDisplayMode = this.wallet.settings.balanceDisplayMode === 'zano' ? 'fiat' : 'zano';
        this.wallet.settingsChanged$.next(this.wallet.settings);
    }

    private initObservables(): void {
        const settings$ = this.wallet.settingsChanged$.pipe(startWith(this.wallet.settings));

        this.totalBalance$ = combineLatest([this.wallet.balances$, this.variablesService.currentPriceForAssets$, settings$]).pipe(
            map(([balances, prices, settings]) => this.calculateTotalBalance(balances, prices, settings))
        );

        const langChange$ = this.translate.onLangChange.pipe(startWith(null));
        this.tooltip$ = combineLatest([this.wallet.balances$, langChange$]).pipe(map(([balances]) => this.createBalancesTooltip(balances)));
    }

    private calculateTotalBalance(
        balances: AssetBalance[],
        prices: CurrentPriceForAssets,
        settings: WalletSettings
    ): { value: string; currency: string } {
        const { currency } = this.variablesService.settings;
        const displayMode = settings.balanceDisplayMode || 'fiat';
        const zanoTicker = ZANO_ASSET_INFO.ticker;

        if (!balances || balances.length === 0) {
            return { value: '---', currency: displayMode === 'zano' ? zanoTicker : currency.toUpperCase() };
        }

        const { totalFiat, hasPositiveBalance, anyPriceFound } = this.calculateTotalFiat(balances, prices, currency);

        if (hasPositiveBalance && !anyPriceFound) {
            return { value: '---', currency: displayMode === 'zano' ? zanoTicker : currency.toUpperCase() };
        }

        if (displayMode === 'zano') {
            const zanoPriceData = prices[ZANO_ASSET_INFO.asset_id]?.data;
            const zanoFiatPrice = zanoPriceData && typeof zanoPriceData !== 'string' ? zanoPriceData.fiat_prices?.[currency] : undefined;

            if (!zanoFiatPrice || zanoFiatPrice === 0) {
                const zanoBalance = balances.find((b) => b.asset_info.asset_id === ZANO_ASSET_INFO.asset_id);
                return {
                    value: this.intToMoneyPipe.transform(zanoBalance?.total ?? 0, zanoBalance?.asset_info.decimal_point),
                    currency: zanoTicker,
                };
            }

            const totalZano = totalFiat.dividedBy(zanoFiatPrice);
            const zanoDecimalPoints = ZANO_ASSET_INFO.decimal_point;
            const totalZanoInt = totalZano.multipliedBy(Math.pow(10, zanoDecimalPoints));

            return {
                value: this.intToMoneyPipe.transform(totalZanoInt, zanoDecimalPoints),
                currency: zanoTicker,
            };
        }

        return {
            value: totalFiat.toFixed(isFiatCurrency(currency) ? 2 : 8),
            currency: currency.toUpperCase(),
        };
    }

    private calculateTotalFiat(
        balances: AssetBalance[],
        prices: CurrentPriceForAssets,
        currency: string
    ): { totalFiat: BigNumber; hasPositiveBalance: boolean; anyPriceFound: boolean } {
        let totalFiat = new BigNumber(0);
        let hasPositiveBalance = false;
        let anyPriceFound = false;

        balances.forEach((balance) => {
            const amount = intToMoney(balance.total, balance.asset_info.decimal_point);
            const bnAmount = new BigNumber(amount);

            if (bnAmount.isGreaterThan(0)) {
                hasPositiveBalance = true;
                const priceData = prices[balance.asset_info.asset_id]?.data;
                if (priceData && typeof priceData !== 'string') {
                    const fiatPrice = priceData.fiat_prices?.[currency];
                    if (fiatPrice) {
                        anyPriceFound = true;
                        totalFiat = totalFiat.plus(bnAmount.multipliedBy(fiatPrice));
                    }
                }
            }
        });

        return { totalFiat, hasPositiveBalance, anyPriceFound };
    }

    private createBalancesTooltip(balances: AssetBalance[]): HTMLDivElement {
        const tooltip = document.createElement('div');
        if (!balances || balances.length === 0) {
            return tooltip;
        }

        const scrollWrapper = document.createElement('div');
        scrollWrapper.classList.add('balance-scroll-list');

        balances.forEach(({ unlocked, total, asset_info: { ticker, decimal_point } }) => {
            const available = this.createTooltipRow(
                this.translate.instant('WALLET.AVAILABLE_BALANCE'),
                unlocked,
                ticker,
                decimal_point,
                'available'
            );
            scrollWrapper.appendChild(available);

            const lockedAmount = new BigNumber(total).minus(unlocked);
            const locked = this.createTooltipRow(
                this.translate.instant('WALLET.LOCKED_BALANCE'),
                lockedAmount,
                ticker,
                decimal_point,
                'locked'
            );
            scrollWrapper.appendChild(locked);
        });

        tooltip.appendChild(scrollWrapper);

        const link = document.createElement('span');
        link.setAttribute('class', 'link');
        link.innerHTML = this.translate.instant('WALLET.LOCKED_BALANCE_LINK');
        link.addEventListener('click', () => {
            this.backend.openUrlInBrowser(LOCKED_BALANCE_HELP_PAGE);
        });
        tooltip.appendChild(link);

        return tooltip;
    }

    private createTooltipRow(
        label: string,
        amount: BigNumber | number,
        ticker: string,
        decimal_point: number,
        cssClass: 'available' | 'locked'
    ): HTMLSpanElement {
        const row = document.createElement('span');
        row.setAttribute('class', cssClass);
        row.innerText = `${label} `;

        const amountB = document.createElement('b');
        amountB.innerText = `${this.intToMoneyPipe.transform(amount, decimal_point)} ${ticker || '---'}`;
        row.appendChild(amountB);

        return row;
    }
}
