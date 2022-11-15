import { Component, NgZone } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BackendService } from '../_helpers/services/backend.service';
import { VariablesService } from '../_helpers/services/variables.service';
import { ModalService } from '../_helpers/services/modal.service';
import { Router } from '@angular/router';
import { Wallet } from '../_helpers/models/wallet.model';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent {
  createForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required, (g: UntypedFormControl) => {
      for (let i = 0; i < this.variablesService.wallets.length; i++) {
        if (g.value === this.variablesService.wallets[i].name) {
          return { 'duplicate': true };
        }
      }
      return null;
    }]),
    password: new UntypedFormControl('', Validators.pattern(this.variablesService.pattern)),
    confirm: new UntypedFormControl('')
  }, function (g: UntypedFormGroup) {
    return g.get('password').value === g.get('confirm').value ? null : { 'confirm_mismatch': true };
  });

  wallet = {
    id: ''
  };

  walletSaved = false;

  walletSavedName = '';

  progressWidth = '9rem';

  constructor(
    public variablesService: VariablesService,
    private router: Router,
    private backend: BackendService,
    private modalService: ModalService,
    private ngZone: NgZone,
    private translate: TranslateService,
    private location: Location,
  ) {
  }

  createWallet(): void {
    this.ngZone.run(() => {
      this.progressWidth = '100%';
      this.router.navigate(['/seed-phrase'], { queryParams: { wallet_id: this.wallet.id } });
    });
  }

  saveWallet(): void {
    if (this.createForm.valid && this.createForm.get('name').value.length <= this.variablesService.maxWalletNameLength) {
      this.backend.saveFileDialog(this.translate.instant('CREATE_WALLET.TITLE_SAVE'), '*', this.variablesService.settings.default_path,
        (file_status, file_data) => {
          if (file_status) {
            this.variablesService.settings.default_path = file_data.path.substr(0, file_data.path.lastIndexOf('/'));
            this.walletSavedName = file_data.path.substr(file_data.path.lastIndexOf('/') + 1, file_data.path.length - 1);
            this.backend.generateWallet(file_data.path, this.createForm.get('password').value,
              (generate_status, generate_data, errorCode) => {
                if (generate_status) {
                  this.wallet.id = generate_data.wallet_id;
                  this.variablesService.opening_wallet = new Wallet(
                    generate_data.wallet_id,
                    this.createForm.get('name').value,
                    this.createForm.get('password').value,
                    generate_data['wi'].path,
                    generate_data['wi'].address,
                    generate_data['wi'].balance,
                    generate_data['wi'].unlocked_balance,
                    generate_data['wi'].mined_total,
                    generate_data['wi'].tracking_hey
                  );
                  this.variablesService.opening_wallet.alias = this.backend.getWalletAlias(generate_data['wi'].address);
                  this.variablesService.opening_wallet.total_history_item = 0;
                  this.variablesService.opening_wallet.pages = new Array(1).fill(1);
                  this.variablesService.opening_wallet.totalPages = 1;
                  this.variablesService.opening_wallet.currentPage = 1;
                  this.ngZone.run(() => {
                    this.walletSaved = true;
                    this.progressWidth = '33%';
                  });
                } else {
                  if (errorCode && errorCode === 'ALREADY_EXISTS') {
                    this.modalService.prepareModal('error', 'CREATE_WALLET.ERROR_CANNOT_SAVE_TOP');
                  } else {
                    this.modalService.prepareModal('error', 'CREATE_WALLET.ERROR_CANNOT_SAVE_SYSTEM');
                  }
                }
              });
          }
        });
    }
  }

  back(): void {
    this.location.back();
  }
}
