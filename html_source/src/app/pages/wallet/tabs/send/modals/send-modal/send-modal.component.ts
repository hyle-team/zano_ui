import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { VariablesService } from '@parts/services/variables.service';

@Component({
  selector: 'app-send-modal',
  templateUrl: './send-modal.component.html',
  styleUrls: ['./send-modal.component.scss'],
})
export class SendModalComponent implements OnInit, OnDestroy {
  @HostBinding('class.modal-overlay') modalOverlay = true;

  @Input() form: UntypedFormGroup;

  @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  confirmForm = new UntypedFormGroup({
    password: new UntypedFormControl(''),
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
