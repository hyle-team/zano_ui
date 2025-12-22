import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetLogoByAssetInfoPipe } from '@parts/pipes/get-logo-by-asset-info.pipe';
import { IntToMoneyPipeModule } from '@parts/pipes';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { VisibilityBalanceDirective } from '@parts/directives/visibility-balance.directive';
import { AssetBalance } from '@api/models/assets.model';
import { ZANO_ASSET_INFO } from '@parts/data/zano-assets-info';
import { DestinationFormGroup } from '../../send.component';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { VariablesService } from '@parts/services/variables.service';

type Items = { asset: AssetBalance; disabled: boolean }[];

@Component({
    selector: 'zano-asset-field',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        GetLogoByAssetInfoPipe,
        IntToMoneyPipeModule,
        IsVisibleControlErrorPipe,
        NgSelectModule,
        ReactiveFormsModule,
        TranslateModule,
        VisibilityBalanceDirective,
    ],
    templateUrl: './asset-field.component.html',
    styleUrls: ['./asset-field.component.scss'],
})
export class AssetFieldComponent implements OnInit {
    @Input('formRef')
    form: DestinationFormGroup;

    items$: Observable<Items>;

    variablesService = inject(VariablesService);

    ngOnInit() {
        this._initItems();
    }

    private _initItems() {
        const balances$ = this.variablesService.current_wallet.balances$;
        const isVisibleWrapInfo$ = this.form.controls.is_visible_wrap_info.valueChanges.pipe(
            startWith(this.form.controls.is_visible_wrap_info.value)
        );

        this.items$ = combineLatest([balances$, isVisibleWrapInfo$]).pipe(
            map(([balances, is_visible_wrap_info]) =>
                balances.map((asset) => {
                    const disabled = asset.asset_info.asset_id === ZANO_ASSET_INFO.asset_id ? false : is_visible_wrap_info;
                    return { asset, disabled };
                })
            )
        );
    }
}
