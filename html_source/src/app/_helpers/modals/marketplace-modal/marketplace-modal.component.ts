import { Component, Input } from '@angular/core';
import { VariablesService } from '../../services/variables.service';

@Component({
  selector: 'app-marketplace-modal',
  templateUrl: './marketplace-modal.component.html',
  styleUrls: ['./marketplace-modal.component.scss']
})
export class MarketplaceModalComponent {
  @Input() public marketplaceData

  constructor(
    public variablesService: VariablesService,
  ) { }

  confirmSend() {

  }

  closeModal() {

  }

}


