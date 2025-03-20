import { Directive, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appDisablePriceFetch]'
})
export class DisablePriceFetchDirective implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private _variablesService: VariablesService,
        private _templateRef: TemplateRef<any>,
        private _viewContainer: ViewContainerRef
    ) {
        this._variablesService.disable_price_fetch$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe({
            next: (disable_price_fetch: boolean) => {
                this._viewContainer.clear();
                if (!disable_price_fetch) {
                    this._viewContainer.createEmbeddedView(this._templateRef);
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
