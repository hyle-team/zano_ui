import { Component, inject, NgZone } from '@angular/core';
import { BackendService } from '@api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CREATE_NEW_WALLET_HELP_PAGE } from '@parts/data/constants';
import { filePathWalletValidator } from '@parts/utils/zano-validators';
import { ModalService } from '@parts/services/modal.service';

@Component({
    selector: 'app-add-wallet',
    templateUrl: './add-wallet.component.html',
    styleUrls: ['./add-wallet.component.scss'],
})
export class AddWalletComponent {
    private translateService = inject(TranslateService);

    constructor(
        public variablesService: VariablesService,
        private router: Router,
        private modalService: ModalService,
        private backendService: BackendService,
        private ngZone: NgZone
    ) {}

    openWallet(): void {
        const caption = this.translateService.instant('MAIN.CHOOSE_PATH');
        const default_path = this.variablesService.settings.default_path;
        this.backendService.openFileDialog(caption, '*', default_path, async (file_status, file_data) => {
            if (!file_status) {
                if (file_data['error_code'] !== 'CANCELED') {
                    this.modalService.prepareModal('error', file_data['error_code']);
                }
                return;
            }
            const positionLastSlash = file_data.path.lastIndexOf('/');
            const new_default_path = file_data.path.slice(0, positionLastSlash);
            const error = filePathWalletValidator(file_data.path);

            if (error) {
                const text = this.translateService.instant(error.errorText);
                this.modalService.prepareModal('error', text);
                return;
            }

            this.variablesService.settings.default_path = new_default_path;
            await this.ngZone.run(async () => {
                await this.router.navigate(['/open'], {
                    queryParams: { path: file_data.path },
                });
            });
        });
    }

    openInBrowser(): void {
        this.backendService.openUrlInBrowser(CREATE_NEW_WALLET_HELP_PAGE);
    }
}
