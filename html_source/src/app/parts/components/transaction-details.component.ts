import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '@api/models/transaction.model';
import { VariablesService } from '../services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { IntToMoneyPipe } from '@parts/pipes';
import {
  BLOCK_EXPLORER_TN_TX_URL_PREFIX,
  BLOCK_EXPLORER_TX_URL_PREFIX,
} from '../data/constants';
import { hasOwnProperty } from '../functions/hasOwnProperty';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { TooltipModule } from '@parts/directives';

@Component({
  selector: 'app-transaction-details',
  template: `
    <div class="table py-1" fxLayout="column">
      <div class="row" fxFlex="100" fxLayout="row" fxLayoutAlign="start center">
        <span
          [style.flex-basis]="sizes[0] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{ 'HISTORY.DETAILS.ID' | translate }}</span
        >
        <span
          (click)="openInBrowser(transaction.tx_hash)"
          (contextmenu)="
            variablesService.onContextMenuOnlyCopy($event, transaction.tx_hash)
          "
          [style.flex-basis]="sizes[1] + 'px'"
          class="cell px-2 py-1 text-ellipsis color-primary cursor-pointer"
          >{{ transaction.tx_hash }}</span
        >
        <span
          [style.flex-basis]="sizes[2] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{ 'HISTORY.DETAILS.SIZE' | translate }}</span
        >
        <span
          [style.flex-basis]="sizes[3] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{
            'HISTORY.DETAILS.SIZE_VALUE'
              | translate : { value: transaction.tx_blob_size }
          }}</span
        >
      </div>
      <div class="row" fxFlex="100" fxLayout="row" fxLayoutAlign="start center">
        <span
          [style.flex-basis]="sizes[0] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{ 'HISTORY.DETAILS.HEIGHT' | translate }}</span
        >
        <span
          [style.flex-basis]="sizes[1] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{ transaction.height }}</span
        >
        <span
          [style.flex-basis]="sizes[2] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{ 'HISTORY.DETAILS.CONFIRMATION' | translate }}</span
        >
        <span
          [style.flex-basis]="sizes[3] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{
            transaction.height === 0
              ? 0
              : variablesService.height_app - transaction.height
          }}</span
        >
      </div>
      <div class="row" fxFlex="100" fxLayout="row" fxLayoutAlign="start center">
        <span
          [style.flex-basis]="sizes[0] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{ 'HISTORY.DETAILS.INPUTS' | translate }}</span
        >
        <span
          [delay]="500"
          [showWhenNoOverflow]="false"
          [style.flex-basis]="sizes[1] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          placement="top"
          tooltip="{{ inputs.join(', ') }}"
          tooltipClass="table-tooltip table-tooltip-dimensions"
          >{{ inputs.join(', ') }}</span
        >
        <span
          [style.flex-basis]="sizes[2] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{ 'HISTORY.DETAILS.OUTPUTS' | translate }}</span
        >
        <span
          [delay]="500"
          [showWhenNoOverflow]="false"
          [style.flex-basis]="sizes[3] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          placement="top"
          tooltip="{{ outputs.join(', ') }}"
          tooltipClass="table-tooltip table-tooltip-dimensions"
          >{{ outputs.join(', ') }}</span
        >
      </div>
      <div class="row" fxFlex="100" fxLayout="row" fxLayoutAlign="start center">
        <span
          [style.flex-basis]="sizes[0] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{ 'HISTORY.DETAILS.PAYMENT_ID' | translate }}</span
        >
        <span
          [delay]="500"
          [showWhenNoOverflow]="false"
          [style.flex-basis]="sizes[1] + sizes[2] + sizes[3] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          placement="top"
          tooltip="{{ transaction.payment_id }}"
          tooltipClass="table-tooltip comment-tooltip"
        >
          {{ transaction.payment_id }}
        </span>
      </div>
      <div class="row" fxFlex="100" fxLayout="row" fxLayoutAlign="start center">
        <span
          [style.flex-basis]="sizes[0] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          >{{ 'HISTORY.DETAILS.COMMENT' | translate }}</span
        >
        <span
          (contextmenu)="
            variablesService.onContextMenuOnlyCopy($event, transaction.comment)
          "
          [delay]="500"
          [showWhenNoOverflow]="false"
          [style.flex-basis]="sizes[1] + sizes[2] + sizes[3] + 'px'"
          class="cell px-2 py-1 text-ellipsis"
          placement="top"
          tooltip="{{ transaction.comment }}"
          tooltipClass="table-tooltip comment-tooltip"
        >
          {{ transaction.comment }}
        </span>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, TranslateModule, FlexModule, TooltipModule],
})
export class TransactionDetailsComponent implements OnInit {
  @Input() transaction: Transaction;

  @Input() sizes: Array<number>;

  inputs: Array<string> = [];

  outputs: Array<string> = [];

  constructor(
    public variablesService: VariablesService,
    private backendService: BackendService,
    private intToMoneyPipe: IntToMoneyPipe
  ) {}

  ngOnInit(): void {
    for (const input in this.transaction.td['spn']) {
      if (hasOwnProperty(this.transaction.td['spn'], input)) {
        this.inputs.push(
          this.intToMoneyPipe.transform(this.transaction.td['spn'][input])
        );
      }
    }
    for (const output in this.transaction.td['rcv']) {
      if (hasOwnProperty(this.transaction.td['rcv'], output)) {
        this.outputs.push(
          this.intToMoneyPipe.transform(this.transaction.td['rcv'][output])
        );
      }
    }
  }

  openInBrowser(tr): void {
    this.backendService.openUrlInBrowser(
      (this.variablesService.testnet
        ? BLOCK_EXPLORER_TN_TX_URL_PREFIX
        : BLOCK_EXPLORER_TX_URL_PREFIX) + tr
    );
  }
}
