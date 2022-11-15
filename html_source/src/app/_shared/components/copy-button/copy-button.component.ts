import { Component, Input } from '@angular/core';
import { BackendService } from '../../../_helpers/services/backend.service';
import { VariablesService } from '../../../_helpers/services/variables.service';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.scss'],
})
export class CopyButtonComponent {
  @Input() value: string;

  @Input() size: 'small' | 'big' = 'small';

  copyAnimation = false;

  copyAnimationTimeout;

  constructor(
    private backend: BackendService,
    public variablesService: VariablesService
  ) {}

  copy(): void {
    this.backend.setClipboard(this.value || '');
    this.copyAnimation = true;
    this.copyAnimationTimeout = window.setTimeout(() => {
      this.copyAnimation = false;
      clearTimeout(this.copyAnimationTimeout);
    }, 2000);
  }
}
