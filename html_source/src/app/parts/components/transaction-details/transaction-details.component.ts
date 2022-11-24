import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '@api/models/transaction.model';
import { VariablesService } from '../../services/variables.service';
import { BackendService } from '@api/services/backend.service';
import { IntToMoneyPipe } from '../../pipes/int-to-money-pipe/int-to-money.pipe';
import {
  BLOCK_EXPLORER_TN_TX_URL_PREFIX,
  BLOCK_EXPLORER_TX_URL_PREFIX,
} from '../../data/constants';
import { hasOwnProperty } from '../../functions/hasOwnProperty';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
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
