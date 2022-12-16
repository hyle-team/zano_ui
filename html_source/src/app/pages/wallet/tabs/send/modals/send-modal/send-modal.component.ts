import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VariablesService } from '@parts/services/variables.service';

@Component({
  selector: 'app-send-modal',
  template: `
    <div
      class="modal p-2 border-radius-0_8-rem bg-light-blue max-w-54-rem w-100 max-h-100"
      fxLayout="row"
    >
      <div class="wrapper">
        <form
          (ngSubmit)="submit()"
          [formGroup]="confirmForm"
          class="overflow-hidden"
          fxFlexFill
          fxLayout="column"
        >
          <h3 class="title mb-2" fxFlex="0 0 auto">
            {{ 'CONFIRM.TITLE' | translate }}
          </h3>

          <div
            class="content mb-2 w-100 overflow-x-hidden overflow-y-auto"
            fxFlex="1 1 auto"
          >
            <div class="table-info mb-2">
              <div class="row">
                <div class="label max-w-19-rem w-100">
                  {{ 'CONFIRM.MESSAGE.SEND' | translate }}
                </div>
                <div class="text">
                  {{ +form.get('amount').value }}
                  {{ variablesService.defaultCurrency }}
                </div>
              </div>

              <hr class="separator" />

              <div class="row">
                <div class="label max-w-19-rem w-100">
                  {{ 'CONFIRM.MESSAGE.FROM' | translate }}
                </div>
                <div class="text">
                  {{ variablesService.currentWallet.address }}
                </div>
              </div>

              <hr class="separator" />

              <div class="row">
                <div class="label max-w-19-rem w-100">
                  {{ 'CONFIRM.MESSAGE.TO' | translate }}
                </div>
                <div class="text">{{ form.get('address').value }}</div>
              </div>

              <ng-container *ngIf="!!form.get('comment').value">
                <hr class="separator" />

                <div class="row">
                  <div class="label max-w-19-rem w-100">
                    {{ 'CONFIRM.MESSAGE.COMMENT' | translate }}
                  </div>
                  <div class="text">{{ form.get('comment').value }}</div>
                </div>
              </ng-container>
            </div>

            <div *ngIf="variablesService.appPass" class="form__field mb-0">
              <label for="password">{{
                'LOGIN.MASTER_PASS' | translate
              }}</label>
              <input
                (contextmenu)="
                  variablesService.onContextMenuPasteSelect($event)
                "
                [placeholder]="
                  'PLACEHOLDERS.MASTER_PASS_PLACEHOLDER' | translate
                "
                autofocus
                class="form__field--input"
                formControlName="password"
                id="password"
                name="password"
                type="password"
              />
              <div
                *ngIf="
                  confirmForm.controls['password'].invalid &&
                  (confirmForm.controls['password'].dirty ||
                    confirmForm.controls['password'].touched)
                "
                class="error"
              >
                <div
                  *ngIf="
                    confirmForm.controls['password'].errors &&
                    confirmForm.controls['password'].errors.passwordNotMatch
                  "
                >
                  {{ 'LOGIN.FORM_ERRORS.MISMATCH' | translate }}
                </div>
                <div
                  *ngIf="confirmForm.controls['password'].errors['required']"
                >
                  {{ 'LOGIN.FORM_ERRORS.PASS_REQUIRED' | translate }}
                </div>
              </div>
            </div>
          </div>

          <div
            class="controls w-100"
            fxFlex="0 0 auto"
            fxLayout="row nowrap"
            fxLayoutGap="1rem"
          >
            <button (click)="onClose()" class="outline big w-100" type="button">
              {{ 'CONFIRM.BUTTON_CANCEL' | translate }}
            </button>
            <button class="primary big w-100" type="submit">
              {{ 'CONFIRM.BUTTON_CONFIRM' | translate }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class SendModalComponent implements OnInit, OnDestroy {
  @HostBinding('class.modal-overlay') modalOverlay = true;

  @Input() form: FormGroup;

  @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  fb = inject(FormBuilder);

  confirmForm = this.fb.group({
    password: this.fb.nonNullable.control(''),
  });

  constructor(
    public variablesService: VariablesService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-scroll');
    if (this.variablesService.appPass) {
      this.confirmForm.controls['password'].setValidators([
        Validators.required,
      ]);
      this.confirmForm.updateValueAndValidity();
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  submit(): void {
    if (this.variablesService.appPass) {
      if (this.confirmForm.controls['password'].value === '') {
        this.confirmForm.controls['password'].setErrors({ requiredPass: true });
        return;
      }
      this.confirmForm.controls['password'].setErrors({ requiredPass: false });
      if (
        this.variablesService.appPass ===
        this.confirmForm.controls['password'].value
      ) {
        this.confirmed.emit(true);
      } else {
        this.confirmForm.controls['password'].setErrors({
          passwordNotMatch: true,
        });
      }
    } else {
      this.confirmed.emit(true);
    }
  }

  onClose(): void {
    this.confirmed.emit(false);
  }
}
