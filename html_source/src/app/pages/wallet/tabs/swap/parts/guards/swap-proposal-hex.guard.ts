import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { IDeactivateComponent } from '@parts/interfaces/deactivete-component.interface';

@Injectable({
    providedIn: 'root'
})
export class SwapProposalHexGuard implements CanDeactivate<IDeactivateComponent> {
    canDeactivate(
        component: IDeactivateComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return component.canExit ? component.canExit() : true;
    }
}
