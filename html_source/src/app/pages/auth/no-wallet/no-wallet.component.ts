import { Component, NgZone } from '@angular/core';
import { CREATE_NEW_WALLET_HELP_PAGE } from '@parts/data/constants';
import { Router } from '@angular/router';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-no-wallet',
    templateUrl: './no-wallet.component.html',
    styleUrls: ['./no-wallet.component.scss'],
})
export class NoWalletComponent {
    get zanoLogo(): string {
        const {
            settings: { isDarkTheme },
        } = this.variablesService;
        return isDarkTheme ? 'assets/icons/blue/zano-logo.svg' : 'assets/icons/blue/light-zano-logo.svg';
    }

    constructor(
        public variablesService: VariablesService,
        private router: Router,
        private backend: BackendService,
        private ngZone: NgZone,
        private translate: TranslateService
    ) {}

    openWallet(): void {
        this.backend.openFileDialog(
            this.translate.instant('MAIN.CHOOSE_PATH'),
            '*',
            this.variablesService.settings.default_path,
            (file_status, file_data) => {
                if (file_status) {
                    this.variablesService.settings.default_path = file_data.path.substr(0, file_data.path.lastIndexOf('/'));
                    this.ngZone.run(() => {
                        this.router
                            .navigate(['/open'], {
                                queryParams: { path: file_data.path },
                            })
                            .then();
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
}
