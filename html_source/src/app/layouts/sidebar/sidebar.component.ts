import { Component, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from '@parts/services/variables.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Wallet } from '@api/models/wallet.model';
import { Subject } from 'rxjs';
import { ZanoLoadersService } from '@parts/services/zano-loaders.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        public variablesService: VariablesService,
        private route: ActivatedRoute,
        private router: Router,
        private ngZone: NgZone,
        public zanoLoadersService: ZanoLoadersService
    ) {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    goMainPage(): void {
        if (this.route.snapshot.queryParams && this.route.snapshot.queryParams.prevUrl === 'login') {
            this.ngZone.run(() => {
                this.router.navigate(['/'], { queryParams: { prevUrl: 'login' } });
            });
        } else {
            this.ngZone.run(() => {
                this.router.navigate(['/']);
            });
        }
    }

    handlerDrop(event: CdkDragDrop<Wallet[]>): void {
        moveItemInArray(this.variablesService.wallets, event.previousIndex, event.currentIndex);
    }

    logout(): void {
        this.zanoLoadersService.open('fullScreen', 'SIDEBAR.SYNCHRONIZATION.LOGGING_OUT');

        setTimeout(() => {
            this.variablesService.stopCountdown();
            this.variablesService.appLogin = false;
            this.variablesService.appPass = '';
            this.ngZone.run(() => {
                this.router.navigate(['/login'], { queryParams: { type: 'auth' } }).then(() => {
                    this.zanoLoadersService.close('fullScreen');
                });
            });
        }, 500);
    }
}
