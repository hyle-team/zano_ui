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

@Component({
    selector: 'app-transfer-alias',
    template: `
        <div class="page-container">
            <div class="toolbar mb-2">
                <div class="left">
                    <app-back-button></app-back-button>
                    <h1 class="ml-2">{{ 'BREADCRUMBS.TRANSFER_ALIAS' | translate }}</h1>
                </div>
                <div class="right"></div>
            </div>

            <div class="page-content">
                <app-breadcrumbs class="mb-2" [items]="breadcrumbItems"></app-breadcrumbs>

                <div class="scrolled-content">
                    <form class="form">
                        <div class="form__field">
                            <label for="alias-name">
                                {{ 'TRANSFER_ALIAS.NAME.LABEL' | translate }}
                            </label>
                            <input
                                [value]="'@' + alias_info.alias"
                                class="form__field--input"
                                id="alias-name"
                                name="alias-name"
                                placeholder="{{ 'EDIT_ALIAS.NAME.PLACEHOLDER' | translate }}"
                                readonly
                                type="text"
                            />
                        </div>

                        <div class="form__field textarea">
                            <label for="alias-comment">
                                {{ 'TRANSFER_ALIAS.COMMENT.LABEL' | translate }}
                            </label>
                            <textarea
                                [(ngModel)]="alias_info.comment"
                                id="alias-comment"
                                name="alias-comment"
                                placeholder="{{ 'EDIT_ALIAS.COMMENT.PLACEHOLDER' | translate }}"
                            ></textarea>
                        </div>

                        <div class="form__field">
                            <label for="alias-transfer">
                                {{ 'TRANSFER_ALIAS.ADDRESS.LABEL' | translate }}
                            </label>
                            <input
                                (contextmenu)="variablesService.onContextMenu($event)"
                                (input)="changeAddress()"
                                [(ngModel)]="transferAddress"
                                [class.invalid]="
                                    transferAddress.length > 0 &&
                                    (transferAddressAlias ||
                                        !transferAddressValid ||
                                        (transferAddressValid && !permissionSend) ||
                                        notEnoughMoney)
                                "
                                class="form__field--input"
                                id="alias-transfer"
                                name="alias-transfer"
                                placeholder="{{ 'TRANSFER_ALIAS.ADDRESS.PLACEHOLDER' | translate }}"
                                type="text"
                            />
                            <div
                                *ngIf="
                                    transferAddress.length > 0 &&
                                    (transferAddressAlias ||
                                        !transferAddressValid ||
                                        (transferAddressValid && !permissionSend) ||
                                        notEnoughMoney)
                                "
                                class="error"
                            >
                                <div *ngIf="!transferAddressValid">
                                    {{ 'TRANSFER_ALIAS.FORM_ERRORS.WRONG_ADDRESS' | translate }}
                                </div>
                                <div *ngIf="transferAddressAlias || (transferAddressValid && !permissionSend)">
                                    {{ 'TRANSFER_ALIAS.FORM_ERRORS.ALIAS_EXISTS' | translate }}
                                </div>
                                <div *ngIf="notEnoughMoney && transferAddressValid && !transferAddressAlias">
                                    {{ 'TRANSFER_ALIAS.FORM_ERRORS.NO_MONEY' | translate }}
                                </div>
                            </div>
                        </div>

                        <div class="alias-cost mb-2">
                            {{
                                'TRANSFER_ALIAS.COST'
                                    | translate
                                        : {
                                              value: variablesService.default_fee,
                                              currency: variablesService.defaultTicker
                                          }
                            }}
                        </div>

                        <button
                            (click)="transferAlias()"
                            [disabled]="transferAddressAlias || !transferAddressValid || notEnoughMoney"
                            class="primary big w-100"
                            type="button"
                        >
                            {{ 'TRANSFER_ALIAS.BUTTON_TRANSFER' | translate }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        `
    ]
})
export class TransferAliasComponent implements OnInit {
    wallet: Wallet;

    alias_info: AliasInfo;

    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/wallet/history',
            title: this.variablesService.current_wallet.name
        },
        {
            title: 'BREADCRUMBS.TRANSFER_ALIAS'
        }
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
        this.backend.validateAddress(this.transferAddress, status => {
            this.transferAddressValid = status;
            if (status) {
                this.backend.getPoolInfo((statusPool, dataPool) => {
                    if (hasOwnProperty(dataPool, 'aliases_que') && dataPool.aliases_que.length) {
                        this.setStatus(!dataPool.aliases_que.some(el => el.address === this.transferAddress));
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
            this.backend.getAliasInfoByAddress(this.transferAddress, status => {
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
}
