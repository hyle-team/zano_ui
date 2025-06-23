import { Injectable, NgZone } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
import { PaginationStore } from './pagination.store';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class PaginationService {
    constructor(private variables: VariablesService, private ngZone: NgZone, private paginationStore: PaginationStore) {}

    paginate(currentPage = 1): void {
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > this.variables.current_wallet.totalPages) {
            currentPage = this.variables.current_wallet.totalPages;
        }
        let startPage: number, endPage: number;
        if (this.variables.current_wallet.totalPages <= this.variables.maxPages) {
            startPage = 1;
            endPage = this.variables.current_wallet.totalPages;
        } else {
            const maxPagesBeforeCurrentPage = Math.floor(this.variables.maxPages / 2);
            const maxPagesAfterCurrentPage = Math.ceil(this.variables.maxPages / 2) - 1;
            if (currentPage <= maxPagesBeforeCurrentPage) {
                startPage = 1;
                this.variables.current_wallet.totalPages > this.variables.maxPages
                    ? (endPage = this.variables.maxPages)
                    : (endPage = this.variables.current_wallet.totalPages);
            } else if (currentPage + maxPagesAfterCurrentPage >= this.variables.current_wallet.totalPages) {
                startPage = this.variables.current_wallet.totalPages - this.variables.maxPages + 1;
                endPage = this.variables.current_wallet.totalPages;
            } else {
                startPage = currentPage - maxPagesBeforeCurrentPage;
                endPage = currentPage + maxPagesAfterCurrentPage;
            }
        }
        this.ngZone.run(() => {
            this.variables.current_wallet.pages = Array.from(Array(endPage + 1 - startPage).keys()).map((i) => startPage + i);
        });
    }

    getOffset(walletID): number {
        const mining = this.variables.current_wallet.exclude_mining_txs;
        const currentPage = this.variables.current_wallet.currentPage;
        let offset = (currentPage - 1) * this.variables.count;
        if (!mining) {
            return offset || 0;
        }
        const value = this.paginationStore.value;
        const pages = value.filter((item) => item.walletID === walletID);
        if (pages && pages.length > 0) {
            const max = _.maxBy(pages, 'page');
            const isForward = this.paginationStore.isForward(pages, currentPage);
            if (isForward) {
                offset = max.offset || 0;
            } else {
                const index = pages.findIndex((item) => item.page === currentPage);
                offset = pages[index].offset || 0;
            }
        }
        return offset;
    }

    calcPages(data): void {
        if (data.total_history_items && data && data.history) {
            this.variables.current_wallet.totalPages = Math.ceil(data.total_history_items / this.variables.count);
            this.variables.current_wallet.totalPages > this.variables.maxPages
                ? (this.variables.current_wallet.pages = new Array(5).fill(1).map((value, index) => value + index))
                : (this.variables.current_wallet.pages = new Array(this.variables.current_wallet.totalPages)
                      .fill(1)
                      .map((value, index) => value + index));
        } else if (this.variables.current_wallet.restore) {
            this.variables.current_wallet.totalPages = Math.ceil((data.history?.length ?? 0) / this.variables.count);
            this.variables.current_wallet.totalPages > this.variables.maxPages
                ? (this.variables.current_wallet.pages = new Array(5).fill(1).map((value, index) => value + index))
                : (this.variables.current_wallet.pages = new Array(this.variables.current_wallet.totalPages)
                      .fill(1)
                      .map((value, index) => value + index));
        }
    }

    prepareHistory(data, status): void {
        if (status && data && data.total_history_items) {
            this.variables.current_wallet.history.splice(0, this.variables.current_wallet.history.length);
            this.ngZone.run(() => {
                this.paginate(this.variables.current_wallet.currentPage);
                if (data.history.length !== 0) {
                    this.variables.current_wallet.restore = false;
                    this.variables.current_wallet.total_history_item = data.total_history_items;
                    this.variables.current_wallet.prepareHistory(data.history);
                    if (this.variables.current_wallet.currentPage === 1 && data.unconfirmed) {
                        this.variables.current_wallet.prepareHistory(data.unconfirmed.sort((a, b) => a.timestamp - b.timestamp));
                    }
                }
            });
        }
    }
}
