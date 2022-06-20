import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, NgZone, OnDestroy } from '@angular/core';
import { VariablesService } from '../_helpers/services/variables.service';
import { BackendService } from '../_helpers/services/backend.service';

@Component({
  selector: 'app-deeplink',
  templateUrl: './deeplink.component.html',
  styleUrls: ['./deeplink.component.scss']
})
export class DeeplinkComponent implements OnDestroy {
  deeplink: string | null = null;

  private destroy$ = new Subject<never>();

  constructor(
    public variablesService: VariablesService,
    private backend: BackendService,
    private ngZone: NgZone,
  ) {
    this.variablesService.deeplink$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.ngZone.run(() => {
        this.deeplink = data;
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
