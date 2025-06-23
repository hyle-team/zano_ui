import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { IDeactivateComponent } from '@parts/interfaces/deactivete-component.interface';

@Injectable({
    providedIn: 'root',
})
export class SwapProposalHexGuard implements CanDeactivate<IDeactivateComponent> {
    canDeactivate(component: IDeactivateComponent): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return component.canExit ? component.canExit() : true;
    }
}
