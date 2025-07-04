import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { Wallet } from '@api/models/wallet.model';
import { BigNumber } from 'bignumber.js';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { AliasInfo } from '@api/models/alias.model';

@Component({
    selector: 'app-edit-alias',
    templateUrl: './edit-alias.component.html',
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        `,
    ],
})
export class EditAliasComponent implements OnInit {
    wallet: Wallet;

    alias_info: AliasInfo;

    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/wallet/history',
            title: this.variablesService.current_wallet.name,
        },
        {
            title: 'BREADCRUMBS.EDIT_ALIAS',
        },
    ];

    oldAliasComment: string;

    notEnoughMoney: boolean;

    requestProcessing = false;

    historyState: { alias_info?: AliasInfo; navigationId?: number };

    constructor(
        public variablesService: VariablesService,
        private router: Router,
        private backend: BackendService,
        private modalService: ModalService,
        private ngZone: NgZone
    ) {
        this.historyState = history.state || {};
    }

    ngOnInit(): void {
        this.wallet = this.variablesService.current_wallet;
        this.alias_info = { ...(this.historyState.alias_info ? this.historyState.alias_info : this.wallet.alias_info) };
        this.oldAliasComment = this.alias_info.comment;
        const balance = new BigNumber(this.wallet.getBalanceByTicker('ZANO')?.unlocked || 0);
        this.notEnoughMoney = balance.isLessThan(this.variablesService.default_fee_big);
    }

    updateAlias(): void {
        if (
            this.requestProcessing ||
            this.notEnoughMoney ||
            this.oldAliasComment === this.alias_info.comment ||
            this.alias_info.comment.length > this.variablesService.maxCommentLength
        ) {
            return;
        }
        this.requestProcessing = true;
        this.backend.updateAlias(this.wallet.wallet_id, this.alias_info, this.variablesService.default_fee, (status) => {
            if (status) {
                this.modalService.prepareModal('success', '');
                this.wallet.alias_info['comment'] = this.alias_info.comment;
                this.ngZone.run(() => {
                    this.router.navigate(['/wallet/']);
                });
            }
            this.requestProcessing = false;
        });
    }
}
