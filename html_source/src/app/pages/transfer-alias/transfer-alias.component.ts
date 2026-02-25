import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { Wallet } from '@api/models/wallet.model';
import { hasOwnProperty } from '@parts/functions/has-own-property';
import BigNumber from 'bignumber.js';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';
import { AliasInfo } from '@api/models/alias.model';
import { MAX_COMMENT_LENGTH } from "@parts/data/constants";

@Component({
    selector: 'app-transfer-alias',
    templateUrl: './transfer-alias.component.html',
})
export class TransferAliasComponent implements OnInit {
    wallet: Wallet;

    alias_info: AliasInfo;

    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/wallet/history',
            title: this.variablesService.current_wallet.name,
        },
        {
            title: 'BREADCRUMBS.TRANSFER_ALIAS',
        },
    ];

    transferAddress = '';

    transferAddressValid: boolean;

    transferAddressAlias: boolean;

    permissionSend: boolean;

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
        const unlocked_balance = new BigNumber(this.wallet.getBalanceByTicker('ZANO')?.unlocked || 0);
        this.notEnoughMoney = unlocked_balance.isLessThan(this.variablesService.default_fee_big);
    }

    changeAddress(): void {
        this.backend.validateAddress(this.transferAddress, (status) => {
            this.transferAddressValid = status;
            if (status) {
                this.backend.getPoolInfo((statusPool, dataPool) => {
                    if (hasOwnProperty(dataPool, 'aliases_que') && dataPool.aliases_que.length) {
                        this.setStatus(!dataPool.aliases_que.some((el) => el.address === this.transferAddress));
                    } else {
                        this.setStatus(status);
                    }
                });
            } else {
                this.setStatus(false);
            }
        });
    }

    setStatus(statusSet): void {
        this.permissionSend = statusSet;
        if (statusSet) {
            this.backend.getAliasInfoByAddress(this.transferAddress, (status) => {
                this.ngZone.run(() => {
                    if (status) {
                        this.transferAddressAlias = true;
                        this.permissionSend = false;
                    } else {
                        this.transferAddressAlias = false;
                    }
                });
            });
        } else {
            this.ngZone.run(() => {
                this.transferAddressAlias = false;
            });
        }
    }

    transferAlias(): void {
        if (this.requestProcessing || !this.permissionSend || !this.transferAddressValid || this.notEnoughMoney) {
            return;
        }
        this.requestProcessing = true;
        this.backend.updateAlias(
            this.wallet.wallet_id,
            { ...this.alias_info, address: this.transferAddress },
            this.variablesService.default_fee,
            (status, data) => {
                if (status && hasOwnProperty(data, 'success') && data.success) {
                    this.modalService.prepareModal('info', 'TRANSFER_ALIAS.REQUEST_SEND_REG');
                    this.ngZone.run(() => {
                        this.router.navigate(['/wallet/']);
                    });
                }
                this.requestProcessing = false;
            }
        );
    }

    protected readonly MAX_COMMENT_LENGTH = MAX_COMMENT_LENGTH;
}
