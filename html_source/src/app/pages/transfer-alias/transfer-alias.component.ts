import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { Wallet } from '@api/models/wallet.model';
import { hasOwnProperty } from '@parts/functions/hasOwnProperty';

@Component({
  selector: 'app-transfer-alias',
  templateUrl: './transfer-alias.component.html',
  styleUrls: ['./transfer-alias.component.scss'],
})
export class TransferAliasComponent implements OnInit {
  wallet: Wallet;

  alias: any;

  transferAddress = '';

  transferAddressValid: boolean;

  transferAddressAlias: boolean;

  permissionSend: boolean;

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
      tracking_key: alias.tracking_key,
    };
    // this.notEnoughMoney = this.wallet.unlocked_balance.isLessThan(
    //   this.variablesService.default_fee_big
    // );
    this.notEnoughMoney = false;
  }

  changeAddress(): void {
    this.backend.validateAddress(this.transferAddress, status => {
      this.transferAddressValid = status;
      if (status) {
        this.backend.getPoolInfo((statusPool, dataPool) => {
          if (
            hasOwnProperty(dataPool, 'aliases_que') &&
            dataPool.aliases_que.length
          ) {
            this.setStatus(
              !dataPool.aliases_que.some(
                el => el.address === this.transferAddress
              )
            );
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
      this.backend.getAliasByAddress(this.transferAddress, status => {
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
    if (
      this.requestProcessing ||
      !this.permissionSend ||
      !this.transferAddressValid ||
      this.notEnoughMoney
    ) {
      return;
    }
    this.requestProcessing = true;
    const newAlias = {
      name: this.alias.name,
      address: this.transferAddress,
      comment: this.alias.comment,
      tracking_key: this.alias.tracking_key,
    };
    this.backend.updateAlias(
      this.wallet.wallet_id,
      newAlias,
      this.variablesService.default_fee,
      (status, data) => {
        if (status && hasOwnProperty(data, 'success') && data.success) {
          this.modalService.prepareModal(
            'info',
            'TRANSFER_ALIAS.REQUEST_SEND_REG'
          );
          this.ngZone.run(() => {
            this.router.navigate(['/wallet/']);
          });
        }
        this.requestProcessing = false;
      }
    );
  }
}
