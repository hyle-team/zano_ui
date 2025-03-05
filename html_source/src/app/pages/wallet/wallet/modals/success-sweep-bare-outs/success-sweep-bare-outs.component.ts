import { Component, inject } from '@angular/core';
import { SweepBareOuts } from '@api/models/rpc.models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-success-sweep-bare-outs',
    templateUrl: './success-sweep-bare-outs.component.html',
    styleUrls: ['./success-sweep-bare-outs.component.scss']
})
export class SuccessSweepBareOutsComponent {
    readonly data: SweepBareOuts = inject<SweepBareOuts>(MAT_DIALOG_DATA);

    stateDetails: boolean = false;

    toggleDetails(): void {
        this.stateDetails = !this.stateDetails;
    }
}
