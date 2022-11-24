import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { BackendService } from '../../api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { ModalService } from '@parts/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Wallet } from '../../api/models/wallet.model';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { hasOwnProperty } from '@parts/functions/hasOwnProperty';

@Component({
  selector: 'app-open-wallet',
  templateUrl: './open-wallet.component.html',
  styleUrls: ['./open-wallet.component.scss'],
})
export class OpenWalletComponent implements OnInit, OnDestroy {
  queryRouting;

  filePath: string;

  openForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [
      Validators.required,
      (g: UntypedFormControl): ValidationErrors | null => {
        for (let i = 0; i < this.variablesService.wallets.length; i++) {
          if (g.value === this.variablesService.wallets[i].name) {
            return { duplicate: true };
          }
        }
        return null;
      },
    ]),
    password: new UntypedFormControl(''),
  });

  constructor(
    public variablesService: VariablesService,
    private route: ActivatedRoute,
    private router: Router,
    private backend: BackendService,
    private modalService: ModalService,
    private ngZone: NgZone,
    private location: Location,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.queryRouting = this.route.queryParams.subscribe(params => {
      if (params.path) {
        this.filePath = params.path;
        let filename = '';
        if (params.path.lastIndexOf('.') === -1) {
          filename = params.path.substr(params.path.lastIndexOf('/') + 1);
        } else {
          filename = params.path.substr(
            params.path.lastIndexOf('/') + 1,
            params.path.lastIndexOf('.') - 1 - params.path.lastIndexOf('/')
          );
        }
        if (filename.length > 25) {
          filename = filename.slice(0, 25);
        }
        this.openForm.get('name').setValue(filename);
        this.openForm.get('name').markAsTouched();
      }
    });
  }

  ngOnDestroy(): void {
    this.queryRouting.unsubscribe();
  }

  openWallet(): void {
    if (
      this.openForm.valid &&
      this.openForm.get('name').value.length <=
        this.variablesService.maxWalletNameLength
    ) {
      this.backend.openWallet(
        this.filePath,
        this.openForm.get('password').value,
        this.variablesService.count,
        false,
        (open_status, open_data, open_error) => {
          if (open_error === 'WRONG_PASSWORD') {
            this.ngZone.run(() => {
              this.openForm.get('password').setErrors({
                wrong_password: {
                  text: 'Wrong password',
                },
              } as ValidationErrors);
            });
          }
          if (open_error && open_error === 'FILE_NOT_FOUND') {
            let error_translate = this.translate.instant(
              'OPEN_WALLET.FILE_NOT_FOUND1'
            );
            error_translate += ':<br>' + this.filePath;
            error_translate += this.translate.instant(
              'OPEN_WALLET.FILE_NOT_FOUND2'
            );
            this.modalService.prepareModal('error', error_translate);
          } else {
            if (open_status || open_error === 'FILE_RESTORED') {
              let exists = false;
              this.variablesService.wallets.forEach(wallet => {
                if (wallet.address === open_data['wi'].address) {
                  exists = true;
                }
              });

              if (exists) {
                this.modalService.prepareModal(
                  'error',
                  'OPEN_WALLET.WITH_ADDRESS_ALREADY_OPEN'
                );
                this.backend.closeWallet(open_data.wallet_id, () => {
                  this.ngZone.run(() => {
                    this.router.navigate(['/']);
                  });
                });
              } else {
                const new_wallet = new Wallet(
                  open_data.wallet_id,
                  this.openForm.get('name').value,
                  this.openForm.get('password').value,
                  open_data['wi'].path,
                  open_data['wi'].address,
                  open_data['wi'].balance,
                  open_data['wi'].unlocked_balance,
                  open_data['wi'].mined_total,
                  open_data['wi'].tracking_hey
                );
                this.backend.getWalletInfo(new_wallet);
                new_wallet.alias = this.backend.getWalletAlias(
                  new_wallet.address
                );
                new_wallet.currentPage = 1;
                new_wallet.open_from_exist = true;
                new_wallet.exclude_mining_txs = false;
                new_wallet.is_auditable = open_data['wi'].is_auditable;
                new_wallet.is_watch_only = open_data['wi'].is_watch_only;
                if (
                  open_data.recent_history &&
                  open_data.recent_history.history
                ) {
                  new_wallet.total_history_item =
                    open_data.recent_history.total_history_items;
                  new_wallet.totalPages = Math.ceil(
                    open_data.recent_history.total_history_items /
                      this.variablesService.count
                  );
                  new_wallet.totalPages > this.variablesService.maxPages
                    ? (new_wallet.pages = new Array(5)
                        .fill(1)
                        .map((value, index) => value + index))
                    : (new_wallet.pages = new Array(new_wallet.totalPages)
                        .fill(1)
                        .map((value, index) => value + index));
                  new_wallet.prepareHistory(open_data.recent_history.history);
                } else {
                  new_wallet.total_history_item = 0;
                  new_wallet.pages = new Array(1).fill(1);
                  new_wallet.totalPages = 1;
                }
                this.backend.getContracts(
                  open_data.wallet_id,
                  (contracts_status, contracts_data) => {
                    if (
                      contracts_status &&
                      hasOwnProperty(contracts_data, 'contracts')
                    ) {
                      this.ngZone.run(() => {
                        new_wallet.prepareContractsAfterOpen(
                          contracts_data.contracts,
                          this.variablesService.exp_med_ts,
                          this.variablesService.height_app,
                          this.variablesService.settings.viewedContracts,
                          this.variablesService.settings.notViewedContracts
                        );
                      });
                    }
                  }
                );
                this.variablesService.wallets.push(new_wallet);
                this.backend.runWallet(
                  open_data.wallet_id,
                  (run_status, run_data) => {
                    if (run_status) {
                      if (this.variablesService.appPass) {
                        this.backend.storeSecureAppData();
                      }
                      this.ngZone.run(() => {
                        this.variablesService.setCurrentWallet(
                          open_data.wallet_id
                        );
                        this.router.navigate(['/wallet/']);
                      });
                    } else {
                      console.log(run_data['error_code']);
                    }
                  }
                );
              }
            }
          }
        }
      );
    }
  }

  back(): void {
    this.location.back();
  }
}