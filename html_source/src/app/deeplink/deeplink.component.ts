import { Subscription } from 'rxjs';
import { DeeplinkParams, PushOffer, Wallet } from './../_helpers/models/wallet.model';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VariablesService } from '../_helpers/services/variables.service';
import { BackendService } from '../_helpers/services/backend.service';
import { MIXIN } from '../_shared/constants';
import { BigNumber } from 'bignumber.js';

@Component({
  selector: 'app-deeplink',
  templateUrl: './deeplink.component.html',
  styleUrls: ['./deeplink.component.scss']
})
export class DeeplinkComponent implements OnInit {
  deeplink: string | null = null;
  secondStep = false;
  walletToPayId = 0
  marketplaceModalShow = true;
  copyAnimation = false;
  marketplaceConfirmHash: any = null
  sendRoute = false;
  deeplinkSubscription: Subscription
  actionData: DeeplinkParams = {}
  defaultMixin = MIXIN
  walletsTopay: Array<Wallet> = [];

  constructor(
    private _router: Router,
    public variablesService: VariablesService,
    private backend: BackendService,
  ) {
    this.deeplinkSubscription = this.variablesService.deeplink$.subscribe((data) => {
      if (data) {
        this.deeplink = data;
        this.actionData = {};
        this.walletsTopay = this.variablesService.wallets.filter(wallet => !wallet.is_watch_only || !wallet.is_auditable)
        if (this.walletsTopay.length === 0) {
          this.variablesService.deeplink$.next(null)
          return
        }
        this.actionData = this.parceString(this.deeplink);
        if (this.walletsTopay.length === 1) {
          setTimeout(() => {
            this.nextStep()
          }, 200)
        }
      } else {
        this.deeplink = null;
      }
    });
  }


  ngOnInit() {
  }

  parceString(string) {
    let newstring = string.substr(5)
    let newobj = {};
    newstring.split('&').forEach(function (value) {
      let keypair = value.split('=');
      newobj[keypair[0]] = keypair[1].replace(/'|"|”|%E2%80%9D|%22/g, '').replace(/%20/g, " ").trim();
    });
    return newobj
  }

  canselAction() {
    this.deeplink = null
    this.variablesService.deeplink$.next(null)
    this.variablesService.sendActionData$.next({});
    this.actionData = {};
  }

  marketplaceSend() {
    let offerObject: PushOffer = {
      wallet_id: this.walletToPayId,
      od: {
        ap: this.actionData.price || '',
        at: '1',
        cat: this.actionData.category || '',
        cnt: this.actionData.contact || '',
        com: this.actionData.comment || '',
        do: this.actionData.description || '',
        et: 10,
        fee: new BigNumber('' + ((+this.actionData.fee || +this.variablesService.default_fee) * 1000000000000)),
        lci: '',
        lco: 'World Wide',
        ot: 1,
        pt: 'Credit cards, BTC, ZANO, ETH',
        t: this.actionData.title || '',
        url: this.actionData.img_url || '',
      },
    }
    this.backend.push_offer(offerObject, (Status, data) => {
      if (data.success) {
        this.marketplaceModalShow = false;
        this.marketplaceConfirmHash = data.tx_hash
      } else {
        this.canselAction()
      }
    })
  }


  copyHash() {
    this.backend.setClipboard(this.marketplaceConfirmHash);
    this.copyAnimation = true;
    setTimeout(() => {
      this.copyAnimation = false;
    }, 2000);
  }

  nextStep() {
    if (this.actionData.action === "send") {
      this.variablesService.sendActionData$.next(this.actionData);
      this.variablesService.deeplink$.next(null)
      this.variablesService.setCurrentWallet(this.walletToPayId)
      this._router.navigate(['/wallet/send']);
    } else if (this.actionData.action === "escrow") {
      this.variablesService.sendActionData$.next(this.actionData);
      this.variablesService.deeplink$.next(null)
      this.variablesService.setCurrentWallet(this.walletToPayId)
      this._router.navigate(['/wallet/contracts/purchase']);
    } else {
      this.secondStep = true
    }
  }

  ngOnDestroy() {
    this.deeplinkSubscription.unsubscribe();
    this.variablesService.deeplink$.next(null)
  }
}
