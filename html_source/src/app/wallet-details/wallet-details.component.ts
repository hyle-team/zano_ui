import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BackendService } from '../_helpers/services/backend.service';
import { VariablesService } from '../_helpers/services/variables.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ValidationErrors } from '@angular/forms/src/directives/validators';

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

  detailsForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      (g: FormControl) => {
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
    path: new FormControl(''),
  });

  seedPhraseForm = new FormGroup(
    {
      password: new FormControl(
        '',
        Validators.pattern(this.variablesService.pattern)
      ),
      confirmPassword: new FormControl(
        '',
        Validators.pattern(this.variablesService.pattern)
      ),
    },
    { validators: this.checkPasswords }
  );

  constructor(
    public variablesService: VariablesService,
    private router: Router,
    private backend: BackendService,
    private ngZone: NgZone,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.showSeed = false;
    this.detailsForm
      .get('name')
      .setValue(this.variablesService.currentWallet.name);
    this.detailsForm
      .get('path')
      .setValue(this.variablesService.currentWallet.path);
  }

  checkPasswords(group: FormGroup): ValidationErrors | null {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
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
          if (data.hasOwnProperty('seed_phrase')) {
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
      this.variablesService.currentWallet.name = this.detailsForm.get(
        'name'
      ).value;
      this.detailsForm.reset({ name: this.variablesService.currentWallet.name, path: this.variablesService.currentWallet.path });
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
