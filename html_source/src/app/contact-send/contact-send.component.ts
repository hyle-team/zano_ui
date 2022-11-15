import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { VariablesService } from '../_helpers/services/variables.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contact-send',
  templateUrl: './contact-send.component.html',
  styleUrls: ['./contact-send.component.scss'],
})
export class ContactSendComponent implements OnInit, OnDestroy {
  queryRouting;

  address;

  constructor(
    public variablesService: VariablesService,
    private location: Location,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.queryRouting = this.route.queryParams.subscribe(params => {
      if (params.address) {
        this.address = params.address;
      }
    });
  }

  ngOnDestroy(): void {
    this.queryRouting.unsubscribe();
  }

  goToWallet(id): void {
    this.variablesService.setCurrentWallet(id);
    this.variablesService.currentWallet.send_data['address'] = this.address;
    this.ngZone.run(() => {
      this.router.navigate(['/wallet/send'], { queryParams: { send: true } });
    });
  }

  back(): void {
    this.location.back();
  }
}
