import { DeeplinkParams } from './../_helpers/models/wallet.model';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../_helpers/services/backend.service';
import { VariablesService } from '../_helpers/services/variables.service';

@Component({
  selector: 'app-deeplink',
  templateUrl: './deeplink.component.html',
  styleUrls: ['./deeplink.component.scss']
})
export class DeeplinkComponent implements OnInit {
  public syncModalShow: boolean = true;
  public walletToPayId: number = 0
  private subRouting1: any;
  public marketplaceModalShow: boolean = false;
  public marketplaceData: DeeplinkParams = {
    title: 'Brand-new braces for knee',
    description: 'Supper braces that help to prevent QCL injury of your knee',
    category: 'Motocross Gear',
    price: 500,
    img_url: 'http://some.some/image.jpg',
    contact: 'TG @zina, Skype: zinazina',
    comments: 'some comments',
    mixins: 11,
    fee: 1,
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backend: BackendService,
    public variablesService: VariablesService,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.subRouting1 = this.route.params.subscribe((params) => {
      // this.walletID = +params['id'];

    });
  }



  closeSelWalletModal() {

  }

  nextStep() {

  }

  contactsRoute() {
    if (this.variablesService.appPass) {
      // this.router.navigate(['/contacts']);
    } else {

    }
  }

  ngOnDestroy() {
    this.subRouting1.unsubscribe();
  }
}
