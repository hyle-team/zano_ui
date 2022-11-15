import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BackendService } from '../_helpers/services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from '../_helpers/services/variables.service';
import { ModalService } from '../_helpers/services/modal.service';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-seed-phrase',
  templateUrl: './seed-phrase.component.html',
  styleUrls: ['./seed-phrase.component.scss'],
})
export class SeedPhraseComponent implements OnInit, OnDestroy {
  queryRouting;

  seedPhrase = '';

  showSeed = false;

  wallet_id: number;

  seedPhraseCopied = false;

  progressWidth = '66%';

  detailsForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [
      Validators.required,
      (g: UntypedFormControl) => {
        for (let i = 0; i < this.variablesService.wallets.length; i++) {
          if (g.value === this.variablesService.wallets[i].name) {
            if (
              this.variablesService.wallets[i].wallet_id ===
              this.variablesService.currentWallet.wallet_id
            ) {
              return { same: true };
            } else {
              return { duplicate: true };
            }
          }
        }
        return null;
      },
    ]),
    path: new UntypedFormControl(''),
  });

  seedPhraseForm = new UntypedFormGroup(
    {
      password: new UntypedFormControl(
        '',
        Validators.pattern(this.variablesService.pattern)
      ),
      confirmPassword: new UntypedFormControl(
        '',
        Validators.pattern(this.variablesService.pattern)
      ),
    },
    { validators: this.checkPasswords }
  );

  constructor(
    public variablesService: VariablesService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private backend: BackendService,
    private modalService: ModalService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.showSeed = false;
    this.getWalletId();
    this.setWalletInfoNamePath();
  }

  ngOnDestroy(): void {
    this.queryRouting.unsubscribe();
  }

  checkPasswords(group: UntypedFormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  runWallet(): void {
    let exists = false;
    this.variablesService.wallets.forEach(wallet => {
      if (wallet.address === this.variablesService.opening_wallet.address) {
        exists = true;
      }
    });
    if (!exists) {
      this.backend.runWallet(this.wallet_id, (run_status, run_data) => {
        if (run_status) {
          this.variablesService.wallets.push(
            this.variablesService.opening_wallet
          );
          if (this.variablesService.appPass) {
            this.backend.storeSecureAppData();
          }
          this.ngZone.run(() => {
            this.variablesService.setCurrentWallet(this.wallet_id);
            this.router.navigate(['/wallet/']);
          });
        } else {
          console.log(run_data['error_code']);
        }
      });
    } else {
      this.variablesService.opening_wallet = null;
      this.modalService.prepareModal(
        'error',
        'OPEN_WALLET.WITH_ADDRESS_ALREADY_OPEN'
      );
      this.backend.closeWallet(this.wallet_id, () => {
        this.ngZone.run(() => {
          this.router.navigate(['/']);
        });
      });
    }
  }

  copySeedPhrase(): void {
    this.backend.setClipboard(this.seedPhrase, () => {
      this.ngZone.run(() => {
        setTimeout(() => {
          this.seedPhraseCopied = false;
        }, 4000);
        this.seedPhraseCopied = true;
      });
    });
  }

  back(): void {
    this.location.back();
  }

  showSeedPhrase(): void {
    this.showSeed = true;
    this.progressWidth = '100%';
  }

  onSubmitSeed(): void {
    if (this.seedPhraseForm.valid) {
      this.showSeedPhrase();
      const wallet_id = this.wallet_id;
      const seed_password = this.seedPhraseForm.controls.password.value;
      this.backend.getSmartWalletInfo(
        { wallet_id, seed_password },
        (status, data) => {
          if (data.hasOwnProperty('seed_phrase')) {
            this.ngZone.run(() => {
              this.seedPhrase = data['seed_phrase'].trim();
            });
          }
        }
      );
    }
  }

  private setWalletInfoNamePath(): void {
    this.detailsForm
      .get('name')
      .setValue(this.variablesService.opening_wallet.name);
    this.detailsForm
      .get('path')
      .setValue(this.variablesService.opening_wallet.path);
  }

  private getWalletId(): void {
    this.queryRouting = this.route.queryParams.subscribe(params => {
      if (params.wallet_id) {
        this.wallet_id = params.wallet_id;
      }
    });
  }
}
