import { Component, NgZone, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BackendService } from '../../api/services/backend.service';
import { VariablesService } from '@parts/services/variables.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { hasOwnProperty } from '@parts/functions/hasOwnProperty';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.scss'],
})
export class WalletDetailsComponent implements OnInit {
  seedPhrase = '';

  showSeed = false;

  seedPhraseCopied = false;

  ifSaved = false;

  detailsForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [
      Validators.required,
      (g: UntypedFormControl): ValidationErrors | null => {
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
    {
      validators: (group: UntypedFormGroup): ValidationErrors | null => {
        const pass = group.controls.password.value;
        const confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true };
      },
    }
  );

  constructor(
    public variablesService: VariablesService,
    private router: Router,
    private backend: BackendService,
    private ngZone: NgZone,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.showSeed = false;
    this.detailsForm
      .get('name')
      .setValue(this.variablesService.currentWallet.name);
    this.detailsForm
      .get('path')
      .setValue(this.variablesService.currentWallet.path);
  }

  showSeedPhrase(): void {
    this.showSeed = true;
  }

  onSubmitSeed(): void {
    if (this.seedPhraseForm.valid) {
      this.showSeedPhrase();
      const wallet_id = this.variablesService.currentWallet.wallet_id;
      const seed_password = this.seedPhraseForm.controls.password.value;
      this.backend.getSmartWalletInfo(
        { wallet_id, seed_password },
        (status, data) => {
          if (hasOwnProperty(data, 'seed_phrase')) {
            this.ngZone.run(() => {
              this.seedPhrase = data['seed_phrase'].trim();
            });
          }
        }
      );
    }
  }

  onSave(): void {
    this.ifSaved = true;
    setTimeout(() => {
      this.ifSaved = false;
    }, 3000);
  }

  onSubmitEdit(): void {
    if (this.detailsForm.value) {
      this.onSave();
      this.variablesService.currentWallet.name =
        this.detailsForm.get('name').value;
      this.detailsForm.reset({
        name: this.variablesService.currentWallet.name,
        path: this.variablesService.currentWallet.path,
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
}
