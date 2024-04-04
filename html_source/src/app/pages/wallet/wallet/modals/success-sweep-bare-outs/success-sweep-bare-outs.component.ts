import { Component, inject, OnInit } from '@angular/core';
import { SweepBareOuts } from '@api/models/rpc.models';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-success-sweep-bare-outs',
  templateUrl: './success-sweep-bare-outs.component.html',
  styleUrls: ['./success-sweep-bare-outs.component.scss']
})
export class SuccessSweepBareOutsComponent {
    readonly dialogData: SweepBareOuts = inject<SweepBareOuts>(DIALOG_DATA);
    private readonly _dialogRef = inject(DialogRef);
    stateDetails$ = new BehaviorSubject<boolean>(false);

    toggleDetails(): void {
        this.stateDetails$.next(!this.stateDetails$.value);
    }

    close(): void {
        this._dialogRef.close();
    }
}
