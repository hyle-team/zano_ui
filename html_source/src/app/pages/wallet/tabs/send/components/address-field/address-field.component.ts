import { Component, inject, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsVisibleControlErrorPipe } from '@parts/pipes/is-visible-control-error.pipe';
import { LoaderComponent } from '@parts/components/loader.component';
import { LowerCaseDirective } from '@parts/directives';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ShortStringPipe } from '@parts/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { merge, Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil, tap } from 'rxjs/operators';
import { WalletsService } from '@parts/services/wallets.service';
import { VariablesService } from '@parts/services/variables.service';
import { DestinationFormGroup } from '../../send.component';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { BackendService } from '@api/services/backend.service';

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
    @Input('formRef') form: DestinationFormGroup;

    @Input() label: string = 'SEND.ADDRESS';

    @Input() placeholder: string = 'PLACEHOLDERS.ADDRESS_PLACEHOLDER';

    @ViewChild(CdkVirtualScrollViewport)
    cdkVirtualScrollViewPort: CdkVirtualScrollViewport;

    itemSize = 40;

    readonly variablesService: VariablesService = inject(VariablesService);

    items: string[] = [];

    loading = false;

    lowerCaseDisabled = true;

    errorMessages: { [key: string]: string } = {
        address: '',
    };

    get isShowHintNoAliasFound() {
        const {
            controls: {
                address: { value },
            },
        } = this.form;
        return !this.loading && value.startsWith('@') && value.length > 1 && !this.items.length;
    }

    get isShowHintEnterCharToSearch() {
        const {
            controls: {
                address: { value },
            },
        } = this.form;
        return !this.loading && value.startsWith('@') && value.length === 1 && !this.items.length;
    }

    private readonly _ngZone = inject(NgZone);

    private readonly _walletsService = inject(WalletsService);

    private readonly _backendService = inject(BackendService);

    private readonly _openedWalletItems = this._walletsService.opened_wallet_items;

    private readonly _destroy$ = new Subject<void>();

    ngOnInit() {
        const {
            controls: { address: addressControl },
        } = this.form;

        addressControl.valueChanges
            .pipe(
                startWith(addressControl.value),
                tap((value) => {
                    this.loading = true;
                    this.lowerCaseDisabled = !value.startsWith('@');
                }),
                debounceTime(500),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (value) => {
                    const isEnteredAlias = value.startsWith('@');
                    const isEnteredAddress = !isEnteredAlias;

                    if (isEnteredAddress) {
                        this.items = this._openedWalletItems;
                        this.loading = false;
                        return;
                    }

                    const alias_first_leters = value.slice(1); // slice to remove '@' symbol
                    const n_of_items_to_return = 10;

                    this._backendService.alias_lookup({ alias_first_leters, n_of_items_to_return }, (_, { result: { aliases } }) => {
                        this._ngZone.run(() => {
                            this.items = aliases?.map(({ alias }) => '@' + alias) ?? [];
                            this.loading = false;
                        });
                    });
                },
            });

        merge(
            this.form.controls.address.statusChanges,
            this.form.controls.address.valueChanges,
            this.form.statusChanges,
            this.form.valueChanges
        )
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => this.updateErrorMessage());
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }

    handlerPaste(event: ClipboardEvent) {
        event.preventDefault();

        const {
            controls: { address: addressControl },
        } = this.form;
        const { clipboardData } = event;

        let value: string = clipboardData.getData('Text') ?? '';

        const isEnteredAlias = value.startsWith('@');
        this.lowerCaseDisabled = !isEnteredAlias;

        if (isEnteredAlias) {
            value = value.toLowerCase();
        }

        addressControl.patchValue(value);
    }

    handlerContextmenu(event: MouseEvent) {
        this.variablesService.onContextMenu(event);
    }

    trackByFn(index: number, value: string): number | string {
        return value ?? index;
    }

    updateErrorMessage() {
        const address = this.form.controls.address;
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

    openAutocomplete() {
        this.cdkVirtualScrollViewPort?.scrollToIndex(0);
        this.cdkVirtualScrollViewPort?.checkViewportSize();
    }
}
