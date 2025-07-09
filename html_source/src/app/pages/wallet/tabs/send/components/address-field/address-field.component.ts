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
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
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

    variables_service: VariablesService = inject(VariablesService);

    address_items$: Observable<string[]>;

    loading_address_items$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    lower_case_disabled$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    error_messages: { [key: string]: string } = {
        address: '',
    };

    private readonly _wallets_service: WalletsService = inject(WalletsService);

    private readonly _opened_wallet_items: string[] = this._wallets_service.opened_wallet_items;

    private readonly _alias_items: string[] = this.variables_service.all_aliases
        .filter(Boolean)
        .map((alias_info) => '@' + alias_info.alias);

    private readonly _destroy$: Subject<void> = new Subject<void>();

    ngOnInit(): void {
        this.address_items$ = this.control_ref.controls.address.valueChanges.pipe(
            startWith(this.control_ref.controls.address.value),
            tap((value) => {
                const condition = value.startsWith('@');
                this.lower_case_disabled$.next(!condition);
                this.loading_address_items$.next(condition);
            }),
            debounceTime(800),
            map((value) => {
                if (!value?.length) {
                    return this._opened_wallet_items;
                }
                if (value.startsWith('@')) {
                    return this._alias_items.filter((alias) => {
                        return alias.includes(value);
                    });
                }
                return [];
            }),
            tap(() => this.loading_address_items$.next(false))
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
        this.lower_case_disabled$.next(value.indexOf('@') !== 0);

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
        this.error_messages['address'] = message;
    }

    openAutocomplete() {
        this.cdkVirtualScrollViewPort?.scrollToIndex(0);
        this.cdkVirtualScrollViewPort?.checkViewportSize();
    }
}
