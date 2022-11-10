import { Component } from '@angular/core';
import { VariablesService } from '../_helpers/services/variables.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent {
  constructor(
    public variablesService: VariablesService
  ) {
  }

  get sortedArrayContracts(): any[] {
    return this.variablesService.currentWallet.contracts.sort((a, b) => {
      if (a.is_new < b.is_new) {
        return 1;
      }
      if (a.is_new > b.is_new) {
        return -1;
      }
      if (a.timestamp < b.timestamp) {
        return 1;
      }
      if (a.timestamp > b.timestamp) {
        return -1;
      }
      if (a.contract_id < b.contract_id) {
        return 1;
      }
      if (a.contract_id > b.contract_id) {
        return -1;
      }
      return 0;
    });
  }
}
