import { Component, HostBinding, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { Wallet } from '@api/models/wallet.model';
import { BackendService } from '@api/services/backend.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../../services/modal.service';
import { WalletsService } from '@parts/services/wallets.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-open-wallet-modal',
    templateUrl: './open-wallet-modal.component.html',
    styleUrls: ['./open-wallet-modal.component.scss']
})
export class OpenWalletModalComponent implements OnInit, OnDestroy {
    @HostBinding('class.modal-overlay') modalOverlay = true;

    @Input() wallets: any[];

    isWrongPassword$ = new BehaviorSubject<boolean>(false);

    wallet = {
        name: '',
        path: '',
        pass: '',
        notFound: false,
        emptyPass: false
    };

    constructor(
        public variablesService: VariablesService,
        public walletsService: WalletsService,
        private _backendService: BackendService,
        private _translateService: TranslateService,
        private _modalService: ModalService,
        private _ngZone: NgZone,
        private _renderer: Renderer2
    ) {}

    ngOnInit(): void {
        this._renderer.addClass(document.body, 'no-scroll');
        this.initializeWallet();
    }

    ngOnDestroy(): void {
        this._renderer.removeClass(document.body, 'no-scroll');
    }

    initializeWallet(): void {
        if (this.wallets.length) {
            this.wallet = { ...this.wallets[0], pass: '' };
        }
    }

    resetPasswordError(): void {
        this.isWrongPassword$.next(false);
    }

    isFormInvalid(): boolean {
        return this.wallet.notFound || this.isWrongPassword$.value;
    }

    openWallet(): void {
        if (!this.wallets.length) {
            return;
        }

        this._backendService.openWallet(
            this.wallet.path,
            this.wallet.pass,
            this.variablesService.count,
            false,
            this.handleWalletOpening.bind(this)
        );
    }

    handleWalletOpening(open_status, open_data, open_error): void {
        this._ngZone.run(() => {
            if (open_error === 'WRONG_PASSWORD') {
                this.handleWrongPassword();
            } else if (open_error === 'FILE_NOT_FOUND') {
                this.handleFileNotFound();
            } else if (open_status || open_error === 'FILE_RESTORED') {
                this.handleSuccessfulWalletOpen(open_data);
            }
        });
    }

    handleWrongPassword(): void {
        this._ngZone.run(() => {
            this.isWrongPassword$.next(true);
        });
    }

    handleFileNotFound(): void {
        this._ngZone.run(() => {
            this.wallet.notFound = true;
        });

        const errorMessage = `${this._translateService.instant('OPEN_WALLET.FILE_NOT_FOUND1')}:<br>${
            this.wallet.path
        }${this._translateService.instant('OPEN_WALLET.FILE_NOT_FOUND2')}`;
        this._modalService.prepareModal('error', errorMessage);
    }

    handleSuccessfulWalletOpen(open_data): void {
        const walletExists = this.variablesService.wallets.some(wallet => wallet.address === open_data['wi'].address);

        if (walletExists) {
            this._modalService.prepareModal('error', 'OPEN_WALLET.WITH_ADDRESS_ALREADY_OPEN');
            this._backendService.closeWallet(open_data.wallet_id);
        } else {
            this.addNewWallet(open_data);
            this.skipWallet();
            this.isWrongPassword$.next(false);
        }
    }

    addNewWallet(open_data): void {
        const newWallet = this.createWalletFromData(open_data);
        this.walletsService.addWallet(newWallet);
        this._backendService.runWallet(open_data.wallet_id);
    }

    createWalletFromData(open_data): Wallet {
        const newWallet = new Wallet(
            open_data.wallet_id,
            this.wallet.name,
            this.wallet.pass,
            open_data['wi'].path,
            open_data['wi'].address,
            open_data['wi'].balance,
            open_data['wi'].unlocked_balance,
            open_data['wi'].mined_total,
            open_data['wi'].tracking_key
        );
        newWallet.alias = this._backendService.getWalletAlias(newWallet.address);
        newWallet.is_auditable = open_data['wi'].is_auditable;
        newWallet.is_watch_only = open_data['wi'].is_watch_only;
        newWallet.currentPage = 1;
        newWallet.exclude_mining_txs = false;

        if (open_data.recent_history?.history) {
            newWallet.total_history_item = open_data.recent_history.total_history_items;
            newWallet.totalPages = Math.ceil(open_data.recent_history.total_history_items / this.variablesService.count);
            newWallet.pages = this.createPagesArray(newWallet.totalPages);
            newWallet.prepareHistory(open_data.recent_history.history);
        } else {
            newWallet.total_history_item = 0;
            newWallet.pages = [1];
            newWallet.totalPages = 1;
        }

        return newWallet;
    }

    createPagesArray(totalPages: number): number[] {
        return totalPages > this.variablesService.maxPages
            ? Array.from({ length: 5 }, (_, index) => index + 1)
            : Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    skipWallet(): void {
        if (this.wallets.length) {
            this.wallets.shift();
            this.initializeWallet();
        }
    }
}
