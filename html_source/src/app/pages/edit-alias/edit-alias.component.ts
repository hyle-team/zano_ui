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
    template: `
        <div class="page-container">
            <div class="toolbar mb-2">
                <div class="left">
                    <app-back-button></app-back-button>
                    <h1 class="ml-2">{{ 'BREADCRUMBS.EDIT_ALIAS' | translate }}</h1>
                </div>
                <div class="right"></div>
            </div>

            <div class="page-content">
                <app-breadcrumbs class="mb-2" [items]="breadcrumbItems"></app-breadcrumbs>

                <div class="scrolled-content">
                    <form class="form">
                        <div class="form__field">
                            <label for="alias-name">
                                {{ 'EDIT_ALIAS.NAME.LABEL' | translate }}
                            </label>
                            <input
                                [value]="'@' + alias_info.alias"
                                class="form__field--input"
                                id="alias-name"
                                placeholder="{{ 'EDIT_ALIAS.NAME.PLACEHOLDER' | translate }}"
                                readonly
                                type="text"
                            />
                        </div>

                        <div class="form__field textarea">
                            <label for="alias-comment">
                                {{ 'EDIT_ALIAS.COMMENT.LABEL' | translate }}
                            </label>
                            <textarea
                                (contextmenu)="variablesService.onContextMenu($event)"
                                [(ngModel)]="alias_info.comment"
                                [maxlength]="variablesService.maxCommentLength + ''"
                                [ngModelOptions]="{ standalone: true }"
                                id="alias-comment"
                                placeholder="{{ 'EDIT_ALIAS.COMMENT.PLACEHOLDER' | translate }}"
                            >
                            </textarea>
                            <div *ngIf="alias_info.comment.length > 0 && notEnoughMoney" class="error">
                                {{ 'EDIT_ALIAS.FORM_ERRORS.NO_MONEY' | translate }}
                            </div>
                            <div *ngIf="alias_info.comment.length >= variablesService.maxCommentLength" class="error">
                                {{ 'EDIT_ALIAS.FORM_ERRORS.MAX_LENGTH' | translate }}
                            </div>
                        </div>

                        <div class="alias-cost mb-2">
                            {{
                                'EDIT_ALIAS.COST'
                                    | translate
                                        : {
                                              value: variablesService.default_fee,
                                              currency: variablesService.defaultTicker
                                          }
                            }}
                        </div>

                        <button
                            (click)="updateAlias()"
                            [disabled]="
                                notEnoughMoney ||
                                oldAliasComment === alias_info.comment ||
                                alias_info.comment.length > variablesService.maxCommentLength
                            "
                            class="primary big w-100"
                            type="button"
                        >
                            {{ 'EDIT_ALIAS.BUTTON_EDIT' | translate }}
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
export class EditAliasComponent implements OnInit {
    wallet: Wallet;

    alias_info: AliasInfo;

    breadcrumbItems: BreadcrumbItems = [
        {
            routerLink: '/wallet/history',
            title: this.variablesService.current_wallet.name
        },
        {
            title: 'BREADCRUMBS.EDIT_ALIAS'
        }
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
        this.backend.updateAlias(this.wallet.wallet_id, this.alias_info, this.variablesService.default_fee, status => {
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
