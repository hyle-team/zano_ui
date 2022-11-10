import { Component, OnInit } from '@angular/core';
import QRCode from 'qrcode';
import { VariablesService } from '../_helpers/services/variables.service';
import { RCV_ADDR_QR_SCALE } from '../_shared/constants';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {
  qrImageSrc: string;

  constructor(
    public variablesService: VariablesService
  ) {
  }

  ngOnInit() {
    QRCode.toDataURL(this.variablesService.currentWallet.address, {
      width: 200 * RCV_ADDR_QR_SCALE,
      height: 200 * RCV_ADDR_QR_SCALE
    }).then(url => {
      this.qrImageSrc = url;
    }).catch(err => {
      console.error(err);
    });
  }
}
