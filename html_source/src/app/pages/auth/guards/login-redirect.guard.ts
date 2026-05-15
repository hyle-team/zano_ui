import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';

@Injectable({
    providedIn: 'root',
})
export class LoginRedirectGuard implements CanActivate {
    constructor(private variablesService: VariablesService, private router: Router) {}

    canActivate(): boolean | UrlTree {
        return this.variablesService.appLogin === true ? this.router.parseUrl('/add-wallet') : true;
    }
}
