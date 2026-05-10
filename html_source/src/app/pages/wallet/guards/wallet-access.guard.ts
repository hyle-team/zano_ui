import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';

@Injectable({
    providedIn: 'root',
})
export class WalletAccessGuard implements CanActivate, CanActivateChild {
    constructor(private variablesService: VariablesService, private router: Router) {}

    canActivate(): boolean | UrlTree {
        return this._checkWalletAccess();
    }

    canActivateChild(): boolean | UrlTree {
        return this._checkWalletAccess();
    }

    private _checkWalletAccess(): boolean | UrlTree {
        const { wallets, current_wallet } = this.variablesService;

        if (current_wallet) {
            return true;
        }

        return wallets.length > 0 ? true : this.router.parseUrl('/');
    }
}
