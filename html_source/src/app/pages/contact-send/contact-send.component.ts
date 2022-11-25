import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';
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
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.queryRouting = this.route.queryParams.subscribe({
      next: params => {
        if (params.address) {
          this.address = params.address;
        }
      },
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
}
