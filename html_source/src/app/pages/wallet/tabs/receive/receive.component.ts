import { Component, OnInit } from '@angular/core';
import QRCode from 'qrcode';
import { VariablesService } from '@parts/services/variables.service';
import { RCV_ADDR_QR_SCALE } from '@parts/data/constants';

@Component({
    selector: 'app-receive',
    templateUrl: './receive.component.html',
    styles: [
        `
            :host {
                width: 100%;
            }
        `,
    ],
})
export class ReceiveComponent implements OnInit {
    qrImageSrc: string;

    constructor(public variablesService: VariablesService) {}

    ngOnInit(): void {
        QRCode.toDataURL(this.variablesService.current_wallet.address, {
            width: 200 * RCV_ADDR_QR_SCALE,
            height: 200 * RCV_ADDR_QR_SCALE,
        })
            .then((url) => {
                this.qrImageSrc = url;
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
