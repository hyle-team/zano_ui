import {
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { VariablesService } from '@parts/services/variables.service';

@Component({
  selector: 'app-sync-modal',
  templateUrl: './sync-modal.component.html',
  styleUrls: ['./sync-modal.component.scss'],
})
export class SyncModalComponent implements OnInit, OnDestroy {
  @HostBinding('class.modal-overlay') modalOverlay = true;

  constructor(
    private renderer: Renderer2,
    public variablesService: VariablesService
  ) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'no-scroll');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  canselAction(): void {
    this.variablesService.deeplink$.next(null);
    this.variablesService.sendActionData$.next({});
  }
}
