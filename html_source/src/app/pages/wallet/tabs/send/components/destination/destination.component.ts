import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DestinationFormGroup } from '../../send.component';
import { AssetFieldComponent } from '../asset-field/asset-field.component';
import { VariablesService } from '@parts/services/variables.service';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { AssetBalance, PriceInfo } from '@api/models/assets.model';
import { map, retry, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { AddressFieldComponent } from '../address-field/address-field.component';
import { AmountFieldComponent } from '../amount-field/amount-field.component';
import { ApiService } from '@api/services/api.service';

const DEFAULT_PRICE_INFO: PriceInfo = {
    success: false,
    data: 'Asset not found',
};

@Component({
    selector: 'zano-destination',
    standalone: true,
    imports: [CommonModule, MatIconModule, TranslateModule, AssetFieldComponent, AddressFieldComponent, AmountFieldComponent],
    templateUrl: './destination.component.html',
    styleUrls: ['./destination.component.scss'],
})
export class DestinationComponent implements OnInit, OnDestroy {
    @Input() index: number;

    @Input('formRef') form: DestinationFormGroup;

    @Output() onRemove = new EventEmitter<void>();

    variablesService = inject(VariablesService);

    assetItems$: Observable<(AssetBalance & { disabled: boolean })[]>;

    readonly price_info$: BehaviorSubject<PriceInfo> = new BehaviorSubject<PriceInfo>(DEFAULT_PRICE_INFO);

    private readonly _api_service: ApiService = inject(ApiService);

    private readonly _destroy$: Subject<void> = new Subject<void>();

    ngOnInit() {
        this._initAssetItems();
        this._loadPriceInfo();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    remove() {
        this.onRemove.emit();
    }

    private _initAssetItems() {
        this.assetItems$ = combineLatest([
            this.variablesService.current_wallet.balances$,
            this.form.controls.is_visible_wrap_info.valueChanges.pipe(startWith(this.form.controls.is_visible_wrap_info.value)),
        ]).pipe(
            map(([balances, is_visible_wrap_info]) =>
                balances.map((balance) => prepareAssetBalanceToAssetItem(balance, is_visible_wrap_info))
            )
        );
    }

    private _loadPriceInfo(): void {
        this.form.controls.asset_id.valueChanges
            .pipe(
                startWith(this.form.controls.asset_id.value),
                switchMap((assetId) => this._api_service.getCurrentPriceForAsset(assetId).pipe(retry(2))),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (priceInfo: PriceInfo) => {
                    this.price_info$.next(priceInfo);
                },
            });
    }
}

const prepareAssetBalanceToAssetItem = (balance: AssetBalance, disabled: boolean): AssetBalance & { disabled: boolean } => {
    const {
        asset_info: { asset_id },
    } = balance;

    if (asset_id === ZANO_ASSET_INFO.asset_id) {
        return { ...balance, disabled: false };
    }

    return { ...balance, disabled };
};
