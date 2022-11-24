import { Component, NgZone, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BackendService } from '@zano-helpers/services/backend.service';
import { VariablesService } from '@zano-helpers/services/variables.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CREATE_NEW_WALLET_HELP_PAGE } from '@zano-helpers/data/constants';

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.scss'],
})
export class AddWalletComponent implements OnInit {
  prevUrl = '';

  constructor(
    public variablesService: VariablesService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private backend: BackendService,
    private ngZone: NgZone,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (
      this.route.snapshot.queryParams &&
      this.route.snapshot.queryParams.prevUrl
    ) {
      this.prevUrl = this.route.snapshot.queryParams.prevUrl;
    }
  }

  openWallet(): void {
    this.backend.openFileDialog(
      this.translate.instant('MAIN.CHOOSE_PATH'),
      '*',
      this.variablesService.settings.default_path,
      (file_status, file_data) => {
        if (file_status) {
          this.variablesService.settings.default_path = file_data.path.substr(
            0,
            file_data.path.lastIndexOf('/')
          );
          this.ngZone.run(() => {
            this.router.navigate(['/open'], {
              queryParams: { path: file_data.path },
            });
          });
        } else {
          console.log(file_data['error_code']);
        }
      }
    );
  }

  openInBrowser(): void {
    this.backend.openUrlInBrowser(CREATE_NEW_WALLET_HELP_PAGE);
  }

  back(): void {
    this.location.back();
  }
}
