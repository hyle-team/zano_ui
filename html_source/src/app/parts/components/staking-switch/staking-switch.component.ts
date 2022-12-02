import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '../../services/variables.service';

@Component({
  selector: 'app-staking-switch',
  templateUrl: './staking-switch.component.html',
  styleUrls: ['./staking-switch.component.scss'],
})
export class StakingSwitchComponent {
  @Input() wallet_id: number;

  @Input() staking: boolean;

  @Output() stakingChange = new EventEmitter<boolean>();

  constructor(
    private backendService: BackendService,
    private variablesService: VariablesService
  ) {}

  toggleStaking(): void {
    const wallet = this.variablesService.getWallet(this.wallet_id);
    if (wallet && wallet.loaded) {
      this.stakingChange.emit(!this.staking);
      if (!this.staking) {
        this.backendService.startPosMining(this.wallet_id);
      } else {
        this.backendService.stopPosMining(this.wallet_id);
      }
    }
  }
}
