import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmModalComponent, ConfirmModalData } from '@parts/modals/confirm-modal/confirm-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { WalletsService } from '@parts/services/wallets.service';
import { Subject } from 'rxjs';
import { Wallet } from '@api/models/wallet.model';

@Component({
    selector: 'zano-wallet-card-button-close',
    standalone: true,
    imports: [CommonModule, MatTooltipModule, MatIconModule, TranslateModule],
    templateUrl: './wallet-card-button-close.component.html',
    styleUrls: ['./wallet-card-button-close.component.scss'],
})
export class WalletCardButtonCloseComponent {
    @Input() wallet: Wallet;

    private _destroy$ = new Subject<void>();

    constructor(private walletsService: WalletsService, private _matDialog: MatDialog) {}

    beforeClose(event: Event, wallet_id: number): void {
        event.preventDefault();
        event.stopPropagation();

        const config: MatDialogConfig<ConfirmModalData> = {
            data: {
                title: 'WALLET.CONFIRM.MESSAGE',
                message: 'WALLET.CONFIRM.TITLE',
            },
        };

        this._matDialog
            .open<ConfirmModalComponent, ConfirmModalData, boolean>(ConfirmModalComponent, config)
            .afterClosed()
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: (confirmed) => confirmed && this.close(wallet_id),
            });
    }

    close(wallet_id: number): void {
        this.walletsService.closeWallet(wallet_id);
    }
}
