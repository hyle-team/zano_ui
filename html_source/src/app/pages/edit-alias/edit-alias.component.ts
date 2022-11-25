import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { Wallet } from '@api/models/wallet.model';

@Component({
  selector: 'app-edit-alias',
  templateUrl: './edit-alias.component.html',
  styleUrls: ['./edit-alias.component.scss'],
})
export class EditAliasComponent implements OnInit {
  wallet: Wallet;

  alias: any;

  oldAliasComment: string;

  notEnoughMoney: boolean;

  requestProcessing = false;

  constructor(
    public variablesService: VariablesService,
    private router: Router,
    private backend: BackendService,
    private modalService: ModalService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.wallet = this.variablesService.currentWallet;
    const alias = this.backend.getWalletAlias(this.wallet.address);
    this.alias = {
      name: alias.name,
      address: alias.address,
      comment: alias.comment,
    };
    this.oldAliasComment = alias.comment;
    this.notEnoughMoney = this.wallet.unlocked_balance.isLessThan(
      this.variablesService.default_fee_big
    );
  }

  updateAlias(): void {
    if (
      this.requestProcessing ||
      this.notEnoughMoney ||
      this.oldAliasComment === this.alias.comment ||
      this.alias.comment.length > this.variablesService.maxCommentLength
    ) {
      return;
    }
    this.requestProcessing = true;
    this.backend.updateAlias(
      this.wallet.wallet_id,
      this.alias,
      this.variablesService.default_fee,
      status => {
        if (status) {
          this.modalService.prepareModal('success', '');
          this.wallet.alias['comment'] = this.alias.comment;
          this.ngZone.run(() => {
            this.router.navigate(['/wallet/']);
          });
        }
        this.requestProcessing = false;
      }
    );
  }
}
