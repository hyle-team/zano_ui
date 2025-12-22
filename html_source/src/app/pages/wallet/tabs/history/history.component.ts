import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { PaginationService } from '@store/pagination/pagination.service';
import { PaginationStore } from '@store/pagination/pagination.store';
import { Wallet } from '@api/models/wallet.model';
import { BackendService } from '@api/services/backend.service';
import { Subject } from 'rxjs';
import { hasOwnProperty } from '@parts/functions/has-own-property';
import { collapseOnLeaveAnimation, expandOnEnterAnimation } from 'angular-animations';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    animations: [expandOnEnterAnimation(), collapseOnLeaveAnimation()],
})
export class HistoryComponent implements OnInit, OnDestroy {
    public opened_transaction_details: string | undefined;

    public stop_paginate = false;

    public mining = false;

    public wallet: Wallet;

    private _destroy$: Subject<void> = new Subject<void>();

    constructor(
        public variablesService: VariablesService,
        private _pagination: PaginationService,
        private _backendService: BackendService,
        private _ngZone: NgZone,
        private _paginationStore: PaginationStore
    ) {}

    get currentWallet(): Wallet {
        return this.variablesService.current_wallet;
    }

    ngOnInit(): void {
        this.init();

        this.variablesService.currentWalletChangedEvent.pipe(filter(Boolean), takeUntil(this._destroy$)).subscribe({
            next: (wallet: Wallet) => {
                this.getRecentTransfers();
                this.mining = wallet.exclude_mining_txs;
            },
        });
    }

    ngOnDestroy(): void {
        this.opened_transaction_details = undefined;

        this._destroy$.next();
        this._destroy$.complete();
    }

    init(): void {
        let restore = false;
        if (hasOwnProperty(this.variablesService.after_sync_request, String(this.variablesService.current_wallet.wallet_id))) {
            restore = this.variablesService.after_sync_request[this.variablesService.current_wallet.wallet_id];
        }
        if (!this.variablesService.sync_started && restore && this.variablesService.current_wallet.wallet_id) {
            this.wallet = this.variablesService.getNotLoadedWallet();
            if (this.wallet) {
                this.tick();
            }
            // if this is was restore wallet, and it was selected on moment when sync completed
            this.getRecentTransfers();
            this.variablesService.after_sync_request[this.variablesService.current_wallet.wallet_id] = false;
        }
        let after_sync_request = false;
        if (hasOwnProperty(this.variablesService.after_sync_request, String(this.variablesService.current_wallet.wallet_id))) {
            after_sync_request = this.variablesService.after_sync_request[this.variablesService.current_wallet.wallet_id];
        }
        if (after_sync_request && !this.variablesService.sync_started) {
            // if user click on the wallet at the first time after restore.
            this.getRecentTransfers();
        }

        if (hasOwnProperty(this.variablesService.stop_paginate, String(this.variablesService.current_wallet.wallet_id))) {
            this.stop_paginate = this.variablesService.stop_paginate[this.variablesService.current_wallet.wallet_id];
        } else {
            this.stop_paginate = false;
        }
        // this will hide pagination a bit earlier
        this.wallet = this.variablesService.getNotLoadedWallet();
        if (this.wallet) {
            this.tick();
        }
    }

    resetPaginationValues(): void {
        this._ngZone.run(() => {
            const total_history_item = this.variablesService.current_wallet.total_history_item;
            const count = this.variablesService.count;
            this.variablesService.current_wallet.totalPages = Math.ceil(total_history_item / count);
            this.variablesService.current_wallet.exclude_mining_txs = this.mining;
            this.variablesService.current_wallet.currentPage = 1;

            if (!this.variablesService.current_wallet.totalPages) {
                this.variablesService.current_wallet.totalPages = 1;
            }
            this.variablesService.current_wallet.totalPages > this.variablesService.maxPages
                ? (this.variablesService.current_wallet.pages = new Array(5).fill(1).map((value, index) => value + index))
                : (this.variablesService.current_wallet.pages = new Array(this.variablesService.current_wallet.totalPages)
                      .fill(1)
                      .map((value, index) => value + index));
        });
    }

    setPage(pageNumber: number): void {
        // this is will allow pagination for wallets that was open from existed wallets'
        if (pageNumber === this.variablesService.current_wallet.currentPage) {
            return;
        }
        if (this.variablesService.current_wallet.open_from_exist && !this.variablesService.current_wallet.updated) {
            this.variablesService.get_recent_transfers = false;
            this.variablesService.current_wallet.updated = true;
        }
        // if not running get_recent_transfers callback
        if (!this.variablesService.get_recent_transfers) {
            this.variablesService.current_wallet.currentPage = pageNumber;
        }
        if (!this.variablesService.get_recent_transfers) {
            this.getRecentTransfers();
        }
    }

    toggleMiningTransactions(): void {
        if (!this.variablesService.sync_started && !this.wallet) {
            const value = this._paginationStore.value;
            if (!value) {
                this._paginationStore.setPage(1, 0, this.variablesService.current_wallet.wallet_id); // add back page for the first page
            } else {
                const pages = value.filter((item) => item.walletID === this.variablesService.current_wallet.wallet_id);
                if (pages.length === 0) {
                    this._paginationStore.setPage(1, 0, this.variablesService.current_wallet.wallet_id); // add back page for the first page
                }
            }
            this.mining = !this.mining;
            this.resetPaginationValues();
            this.getRecentTransfers();
        }
    }

    getRecentTransfers(): void {
        const offset = this._pagination.getOffset(this.variablesService.current_wallet.wallet_id);
        const value = this._paginationStore.value;
        const pages = value ? value.filter((item) => item.walletID === this.variablesService.current_wallet.wallet_id) : [];
        this._backendService.getRecentTransfers(
            this.variablesService.current_wallet.wallet_id,
            offset,
            this.variablesService.count,
            this.variablesService.current_wallet.exclude_mining_txs,
            (status, data) => {
                const isForward = this._paginationStore.isForward(pages, this.variablesService.current_wallet.currentPage);
                if (this.mining && isForward && pages && pages.length === 1) {
                    this.variablesService.current_wallet.currentPage = 1; // set init page after navigation back
                }

                const history = data && data.history;
                this.variablesService.stop_paginate[this.variablesService.current_wallet.wallet_id] =
                    (history && history.length < this.variablesService.count) || !history;
                this.stop_paginate = this.variablesService.stop_paginate[this.variablesService.current_wallet.wallet_id];
                if (!this.variablesService.stop_paginate[this.variablesService.current_wallet.wallet_id]) {
                    const page = this.variablesService.current_wallet.currentPage + 1;
                    if (isForward && this.mining && history && history.length === this.variablesService.count) {
                        this._paginationStore.setPage(page, data.last_item_index, this.variablesService.current_wallet.wallet_id); // add back page for current page
                    }
                }

                this._pagination.calcPages(data);
                this._pagination.prepareHistory(data, status);

                this._ngZone.run(() => {
                    this.variablesService.get_recent_transfers = false;
                    if (hasOwnProperty(this.variablesService.after_sync_request, String(this.variablesService.current_wallet.wallet_id))) {
                        // this is will complete get_recent_transfers request
                        // this will switch of
                        this.variablesService.after_sync_request[this.variablesService.current_wallet.wallet_id] = false;
                    }
                });
            }
        );
    }

    tick(): void {
        const walletInterval = setInterval(() => {
            this.wallet = this.variablesService.getNotLoadedWallet();
            if (!this.wallet) {
                clearInterval(walletInterval);
            }
        }, 1000);
    }

    toggleTransactionDetails($event: Event, tx_hash: string): void {
        $event.preventDefault();
        $event.stopPropagation();
        if (tx_hash === this.opened_transaction_details) {
            this.opened_transaction_details = undefined;
        } else {
            this.opened_transaction_details = tx_hash;
        }
    }

    protected readonly Array = Array;
}
