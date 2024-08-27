import { Component, Directive, inject, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { VariablesService } from '../services/variables.service';

@Component({
    selector: 'app-hidden',
    template: `******`,
    standalone: true,
})
class HiddenComponent {}

@Directive({
    selector: '[appVisibilityBalance]',
    standalone: true,
})
export class VisibilityBalanceDirective implements OnInit, OnDestroy {
    private _variablesService: VariablesService = inject(VariablesService);
    private _templateRef: TemplateRef<any> = inject(TemplateRef);
    private _viewContainer: ViewContainerRef = inject(ViewContainerRef);
    private _destroy$: Subject<void> = new Subject<void>();

    ngOnInit(): void {
        this._variablesService.visibilityBalance$.pipe(distinctUntilChanged(), takeUntil(this._destroy$)).subscribe({
            next: (visibility: boolean) => {
                this._viewContainer.clear();
                if (visibility) {
                    this._viewContainer.createEmbeddedView(this._templateRef);
                } else {
                    this._viewContainer.createComponent(HiddenComponent);
                }
            },
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }
}
