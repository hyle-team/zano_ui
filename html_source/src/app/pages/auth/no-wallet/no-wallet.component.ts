import { Component, NgZone } from '@angular/core';
import { CREATE_NEW_WALLET_HELP_PAGE } from '../../../_shared/constants';
import { Router } from '@angular/router';
import { BackendService } from '../../../_helpers/services/backend.service';
import { VariablesService } from '../../../_helpers/services/variables.service';
import { TranslateService } from '@ngx-translate/core';
import { paths } from '../../../paths';

@Component({
  selector: 'app-no-wallet',
  templateUrl: './no-wallet.component.html',
  styleUrls: ['./no-wallet.component.scss']
})
export class NoWalletComponent {
  paths = paths;

  constructor(
    public variablesService: VariablesService,
    private router: Router,
    private backend: BackendService,
    private ngZone: NgZone,
    private translate: TranslateService
  ) {
  }

  openWallet(): void {
    this.backend.openFileDialog(
      this.translate.instant('MAIN.CHOOSE_PATH'),
      '*', this.variablesService.settings.default_path,
      (file_status, file_data) => {
        if (file_status) {
          this.variablesService.settings.default_path = file_data.path.substr(0, file_data.path.lastIndexOf('/'));
          this.ngZone.run(() => {
            this.router.navigate(['/' + paths.open], { queryParams: { path: file_data.path } }).then();
          });
        } else {
          console.log(file_data['error_code']);
        }
      });
  }

  openInBrowser(): void {
    this.backend.openUrlInBrowser(CREATE_NEW_WALLET_HELP_PAGE);
  }
}
