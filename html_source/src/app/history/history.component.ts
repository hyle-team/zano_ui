import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { VariablesService } from '../_helpers/services/variables.service';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../_helpers/models/transaction.model';
import BigNumber from 'bignumber.js';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy, AfterViewChecked {
  parentRouting;
  openedDetails = false;
  calculatedWidth = [];
  x = new BigNumber(3);
  y = new BigNumber(0.2);
  // historyMy: Array<Transaction> = [
  //   {
  //     amount: this.x,
  //     comment: "fdgdfg",
  //     contract: [],
  //     fee: this.y,
  //     height: 213124,
  //     is_income: false,
  //     is_mining: true,
  //     is_mixing: true,
  //     is_service: false,
  //     payment_id: "24",
  //     show_sender: false,
  //     td: {},
  //     timestamp: 1635295258,
  //     tx_blob_size: 123,
  //     tx_hash: "vffsadfasd",
  //     tx_type: 4,
  //     unlock_time: 5000000000,
  //   },
  //   {
  //     amount: this.x,
  //     comment: "fdgdfg",
  //     contract: [],
  //     fee: this.y,
  //     height: 212312,
  //     is_income: true,
  //     is_mining: true,
  //     is_mixing: false,
  //     is_service: true,
  //     payment_id: "278",
  //     show_sender: true,
  //     td: {},
  //     timestamp: 1634295258,
  //     tx_blob_size: 236,
  //     tx_hash: "ssdasd",
  //     tx_type: 5,
  //     unlock_time: 50000000,
  //   },
  //   {
  //     amount: this.x,
  //     comment: "fdgdfg",
  //     contract: [],
  //     fee: this.y,
  //     height: 21312,
  //     is_income: true,
  //     is_mining: true,
  //     is_mixing: false,
  //     is_service: false,
  //     payment_id: "23",
  //     show_sender: false,
  //     td: {},
  //     timestamp: 1634295258,
  //     tx_blob_size: 253,
  //     tx_hash: "sdfsdf2",
  //     tx_type: 3,
  //     unlock_time: 50000000,
  //   }
  // ]

  @ViewChild('head') head: ElementRef;

  constructor(
    private route: ActivatedRoute,
    public variablesService: VariablesService
  ) { }

  ngOnInit() {
    this.parentRouting = this.route.parent.params.subscribe(() => {
      this.openedDetails = false;
    });
  }

  ngAfterViewChecked() {
    this.calculateWidth();
  }

  getHeight(item) {
    if ((this.variablesService.height_app - item.height >= 10 && item.height !== 0) || (item.is_mining === true && item.height === 0)) {
      return 100;
    } else {
      if (item.height === 0 || this.variablesService.height_app - item.height < 0) {
        return 0;
      } else {
        return (this.variablesService.height_app - item.height) * 10;
      }
    }
  }

  openDetails(tx_hash) {
    if (tx_hash === this.openedDetails) {
      this.openedDetails = false;
    } else {
      this.openedDetails = tx_hash;
    }
  }

  calculateWidth() {
    this.calculatedWidth = [];
    this.calculatedWidth.push(this.head.nativeElement.childNodes[0].clientWidth);
    this.calculatedWidth.push(this.head.nativeElement.childNodes[1].clientWidth + this.head.nativeElement.childNodes[2].clientWidth);
    this.calculatedWidth.push(this.head.nativeElement.childNodes[3].clientWidth);
    this.calculatedWidth.push(this.head.nativeElement.childNodes[4].clientWidth);
  }

  time(item: Transaction) {
    const now = new Date().getTime();
    const unlockTime = now + ((item.unlock_time - this.variablesService.height_max) * 60 * 1000);
    return unlockTime;
  }

  isLocked(item: Transaction) {
    if ((item.unlock_time > 500000000) && (item.unlock_time > new Date().getTime() / 1000)) {
      return true;
    }
    if ((item.unlock_time < 500000000) && (item.unlock_time > this.variablesService.height_max)) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.parentRouting.unsubscribe();
  }

}
