import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { VariablesService } from '../../../../../../parts/services/variables.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss'],
})
export class AssetDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    public variablesService: VariablesService,
    private dialogRef: DialogRef
  ) {}

  ngOnInit(): void {
    this.listenEventQuitRequested();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    this.dialogRef.close();
  }

  private listenEventQuitRequested(): void {
    this.variablesService.event_quit_requested$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.close();
        },
      });
  }
}
