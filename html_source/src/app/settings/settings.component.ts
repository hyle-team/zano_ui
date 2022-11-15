import { Component, NgZone, OnInit, Renderer2 } from '@angular/core';
import { VariablesService } from '../_helpers/services/variables.service';
import { BackendService } from '../_helpers/services/backend.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { scaleItems } from '../_helpers/data/scale-items';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  ifSaved = false;

  scale: string;

  appUseTor: boolean;

  changeForm: any;

  public currentNotificationsState;

  languagesOptions = [
    {
      name: 'en',
      language: 'SETTINGS.LANGUAGE.EN'
    },
    {
      name: 'fr',
      language: 'SETTINGS.LANGUAGE.FR'
    },
    {
      name: 'de',
      language: 'SETTINGS.LANGUAGE.DE'
    },
    {
      name: 'id',
      language: 'SETTINGS.LANGUAGE.ID'
    },
    {
      name: 'it',
      language: 'SETTINGS.LANGUAGE.IT'
    },
    {
      name: 'pt',
      language: 'SETTINGS.LANGUAGE.PT'
    }
  ];

  appLockOptions = [
    {
      id: 5,
      name: 'SETTINGS.APP_LOCK.TIME1'
    },
    {
      id: 15,
      name: 'SETTINGS.APP_LOCK.TIME2'
    },
    {
      id: 60,
      name: 'SETTINGS.APP_LOCK.TIME3'
    },
    {
      id: 0,
      name: 'SETTINGS.APP_LOCK.TIME4'
    }
  ];

  appScaleOptions = scaleItems;

  appLogOptions = [
    {
      id: -1
    },
    {
      id: 0
    },
    {
      id: 1
    },
    {
      id: 2
    },
    {
      id: 3
    },
    {
      id: 4
    }
  ];

  currentBuild = '';

  appPass: any;

  constructor(
    public translate: TranslateService,
    public variablesService: VariablesService,
    private renderer: Renderer2,
    private backend: BackendService,
    private location: Location,
    private ngZone: NgZone
  ) {
    this.scale = this.variablesService.settings.scale;
    this.appUseTor = this.variablesService.settings.appUseTor;
    this.changeForm = new UntypedFormGroup({
      password: new UntypedFormControl(''),
      new_password: new UntypedFormControl('', Validators.pattern(this.variablesService.pattern)),
      new_confirmation: new UntypedFormControl('')
    }, [(g: UntypedFormGroup) => {
      return g.get('new_password').value === g.get('new_confirmation').value ? null : { 'confirm_mismatch': true };
    }, (g: UntypedFormGroup) => {
      if (this.variablesService.appPass) {
        return g.get('password').value === this.variablesService.appPass ? null : { 'pass_mismatch': true };
      }
      return null;
    }]);
  }

  ngOnInit(): void {
    this.backend.getVersion((version, type) => {
      this.ngZone.run(() => {
        this.currentBuild = version;
        this.variablesService.testnet = false;
        if (type === 'testnet') {
          this.currentBuild += ' TESTNET';
          this.variablesService.testnet = true;
        }
        this.variablesService.networkType = type;
      });
    });
    this.backend.getIsDisabledNotifications((res) => {
      this.currentNotificationsState = res;
    });
  }

  setScale(): void {
    this.scale = this.variablesService.settings.scale;
    this.renderer.setStyle(document.documentElement, 'font-size', this.scale);
    this.backend.storeAppData();
  }

  onSubmitChangePass(): void {
    if (this.changeForm.valid) {
      this.onSave();
      this.variablesService.appPass = this.changeForm.get('new_password').value;
      if (this.variablesService.appPass) {
        this.backend.setMasterPassword({ pass: this.variablesService.appPass }, (status, data) => {
          if (status) {
            this.backend.storeSecureAppData({ pass: this.variablesService.appPass });
            this.variablesService.appLogin = true;
            this.variablesService.dataIsLoaded = true;
            if (this.variablesService.settings.appLockTime) {
              this.variablesService.startCountdown();
            }
          } else {
            console.log(data['error_code']);
          }
        });
      } else {
        // this.backend.dropSecureAppData((status, data) => {
        // });
      }
      this.changeForm.reset();
    }
  }

  toggleNotifications(): void {
    if (!this.currentNotificationsState) {
      this.backend.setIsDisabledNotifications('true');
      this.currentNotificationsState = true;
    } else {
      this.backend.setIsDisabledNotifications('false');
      this.currentNotificationsState = false;
    }
  }

  toggleUseTor(): void {
    this.appUseTor = !this.appUseTor;
    this.variablesService.settings.appUseTor = this.appUseTor;
    this.backend.setEnableTor(this.appUseTor);
    this.backend.storeAppData();
  }

  onSave(): void {
    this.ifSaved = true;
    setTimeout(() => {
      this.ifSaved = false;
    }, 3000);
  }

  onLockChange(): void {
    if (this.variablesService.appLogin && this.variablesService.settings.appLockTime) {
      this.variablesService.restartCountdown();
    }
  }

  onLogChange(): void {
    this.backend.setLogLevel(this.variablesService.settings.appLog);
    this.backend.storeAppData();
  }

  onLanguageChange(): void {
    this.translate.use(this.variablesService.settings.language);
    this.backend.storeAppData();
  }

  back(): void {
    this.location.back();
  }

}
