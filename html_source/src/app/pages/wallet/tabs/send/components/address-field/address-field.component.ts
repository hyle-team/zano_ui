import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';
import { LoaderComponent } from '@parts/components/loader.component';
import { LowerCaseDirective } from '@parts/directives';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ShortStringPipe } from '@parts/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { WalletsService } from '@parts/services/wallets.service';
import { VariablesService } from '@parts/services/variables.service';
import { DestinationsForm } from '../../send.component';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

@Component({
    selector: 'zano-address-field',
    standalone: true,
    imports: [
        CommonModule,
        IsVisibleControlErrorPipe,
        LoaderComponent,
        LowerCaseDirective,
        MatAutocompleteModule,
        MatOptionModule,
        ReactiveFormsModule,
        ShortStringPipe,
        TranslateModule,
        ScrollingModule,
    ],
    templateUrl: './address-field.component.html',
    styleUrls: ['./address-field.component.scss'],
})
export class AddressFieldComponent implements OnInit, OnDestroy {
    @ViewChild(CdkVirtualScrollViewport)
    cdkVirtualScrollViewPort: CdkVirtualScrollViewport;

    @Input() control_ref: DestinationsForm;

    variablesService: VariablesService = inject(VariablesService);

    items$: Observable<string[]>;

    loadingItems$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    lowerCaseDisabled$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    errorMessages: { [key: string]: string } = {
        address: '',
    };

    private readonly _walletsService: WalletsService = inject(WalletsService);

    private readonly _openedWalletItems: string[] = this._walletsService.opened_wallet_items;

    private readonly _destroy$: Subject<void> = new Subject<void>();

    ngOnInit(): void {
        const observable1 = this.control_ref.controls.address.valueChanges.pipe(startWith(this.control_ref.controls.address.value));
        const { aliasInfoList$: observable2 } = this.variablesService;
        this.items$ = combineLatest([observable1, observable2]).pipe(
            tap(([value]) => {
                const condition = value.startsWith('@');
                this.lowerCaseDisabled$.next(!condition);
                this.loadingItems$.next(condition);
            }),
            debounceTime(800),
            map(([value, aliasInfoList]) => {
                if (!value?.length) {
                    return this._openedWalletItems;
                }
                if (value.startsWith('@')) {
                    return aliasInfoList
                        .filter(({ alias }) => alias?.includes(value.slice(1)))
                        .map(({ alias }) => ('@' + alias));
                }
                return [];
            }),
            tap(() => this.loadingItems$.next(false))
        );

        merge(
            this.control_ref.controls.address.statusChanges,
            this.control_ref.controls.address.valueChanges,
            this.control_ref.statusChanges,
            this.control_ref.valueChanges
        )
            .pipe(takeUntil(this._destroy$))
            .subscribe((): void => this.updateAddressErrorMessage());
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    pasteListenAddressField(event: ClipboardEvent): void {
        event.preventDefault();
        const address = this.control_ref.controls.address;
        const { clipboardData } = event;
        let value: string = clipboardData.getData('Text') ?? '';
        this.lowerCaseDisabled$.next(value.indexOf('@') !== 0);

        if (value.indexOf('@') === 0) {
            value = value.toLowerCase();
        }

        address.patchValue(value);
    }

    trackByFn(index: number, value: string): number | string {
        return value ?? index;
    }

    updateAddressErrorMessage(): void {
        const address = this.control_ref.controls.address;
        let message = '';

        switch (true) {
            case address.hasError('address_not_valid'): {
                message = 'SEND.FORM_ERRORS.ADDRESS_NOT_VALID';
                break;
            }
            case address.hasError('alias_not_found'): {
                message = 'SEND.FORM_ERRORS.ALIAS_NOT_FOUND';
                break;
            }
            case address.hasError('alias_not_valid'): {
                message = 'SEND.FORM_ERRORS.ALIAS_NOT_VALID';
                break;
            }
            case address.hasError('required'): {
                message = 'ERRORS.REQUIRED';
                break;
            }
        }
        this.errorMessages['address'] = message;
    }

    openAutocomplete(): void {
        this.cdkVirtualScrollViewPort?.scrollToIndex(0);
        this.cdkVirtualScrollViewPort?.checkViewportSize();
    }
}
