import { Component } from '@angular/core';
import { VariablesService } from '../services/variables.service';
import { DOWNLOADS_PAGE_URL } from '@parts/data/constants';
import { BackendService } from '@api/services/backend.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from '@parts/directives';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-synchronization-status',
    template: `
        <div
            [ngStyle]="{
                'align-items': variablesService.daemon_state === 1 || variablesService.daemon_state === 6 ? 'flex-start' : 'center'
            }"
            class="synchronization-status overflow-hidden"
        >
            <div class="status-container">
                <div *ngIf="variablesService.daemon_state === 0" class="offline">
                    <span>{{ 'SIDEBAR.SYNCHRONIZATION.OFFLINE' | translate }}</span>
                </div>
                <div *ngIf="variablesService.daemon_state === 1" class="syncing text-ellipsis">
                    {{ 'SIDEBAR.SYNCHRONIZATION.SYNCING' | translate }}
                    {{ variablesService.sync.progress_value_text }}%
                </div>
                <div *ngIf="variablesService.daemon_state === 2" class="online">
                    <span>{{ 'SIDEBAR.SYNCHRONIZATION.ONLINE' | translate }}</span>
                </div>
                <div *ngIf="variablesService.daemon_state === 3" class="loading">
                    {{ 'SIDEBAR.SYNCHRONIZATION.LOADING' | translate }}
                </div>
                <div *ngIf="variablesService.daemon_state === 4" class="offline">
                    {{ 'SIDEBAR.SYNCHRONIZATION.ERROR' | translate }}
                </div>
                <div *ngIf="variablesService.daemon_state === 5" class="online">
                    {{ 'SIDEBAR.SYNCHRONIZATION.COMPLETE' | translate }}
                </div>
                <div *ngIf="variablesService.daemon_state === 6" class="syncing text-ellipsis">
                    {{ 'SIDEBAR.SYNCHRONIZATION.DOWNLOADING' | translate }}
                    {{ variablesService.download.progress_value_text }}%
                </div>

                <ng-container *ngIf="variablesService.daemon_state === 1 || variablesService.daemon_state === 3">
                    <div class="progress-bar-container">
                        <div *ngIf="variablesService.daemon_state === 1" class="syncing">
                            <div class="progress-bar">
                                <div [style.width]="variablesService.sync.progress_value + '%'" class="fill"></div>
                            </div>
                        </div>

                        <div *ngIf="variablesService.daemon_state === 3" class="loading"></div>
                    </div>

                    <p class="blocks">
                        <mat-icon
                            class="mr-0_5"
                            style="width: 1.2rem; height: 1.2rem; font-size: 1.2rem; color: var(--block-sync)"
                            svgIcon="zano-block-sync"
                        ></mat-icon>
                        <span>{{ variablesService.sync.blocks.current }}</span>
                        <wbr />
                        /{{ variablesService.sync.blocks.max }} Blocks
                    </p>
                </ng-container>

                <ng-container *ngIf="variablesService.daemon_state === 6">
                    <div class="progress-bar-container">
                        <div class="syncing downloading">
                            <div class="progress-bar">
                                <div [style.width]="variablesService.download.progress_value + '%'" class="fill"></div>
                            </div>
                        </div>
                    </div>
                </ng-container>
            </div>

            <div
                *ngIf="
                    (variablesService.daemon_state === 0 || variablesService.daemon_state === 2) &&
                    [2, 3, 4].indexOf(variablesService.last_build_displaymode) !== -1
                "
                class="update-container"
            >
                <ng-container *ngIf="variablesService.last_build_displaymode === 2">
                    <div class="update-text standard">
                        <span (click)="getUpdate()" [style.cursor]="'pointer'">{{ 'SIDEBAR.UPDATE.STANDARD' | translate }}</span>
                    </div>
                    <i
                        [delay]="500"
                        class="icon update standard"
                        placement="right-bottom"
                        [tooltip]="'SIDEBAR.UPDATE.STANDARD_TOOLTIP' | translate"
                        tooltipClass="update-tooltip"
                    ></i>
                </ng-container>

                <ng-container *ngIf="variablesService.last_build_displaymode === 3">
                    <div class="update-text important">
                        <span (click)="getUpdate()" [style.cursor]="'pointer'">{{ 'SIDEBAR.UPDATE.IMPORTANT' | translate }}</span>
                        <span style="font-size: 1rem">{{ 'SIDEBAR.UPDATE.IMPORTANT_HINT' | translate }}</span>
                    </div>
                    <i
                        [delay]="500"
                        class="icon update important"
                        placement="right-bottom"
                        [tooltip]="'SIDEBAR.UPDATE.IMPORTANT_TOOLTIP' | translate"
                        tooltipClass="update-tooltip important"
                    ></i>
                </ng-container>

                <ng-container *ngIf="variablesService.last_build_displaymode === 4">
                    <div class="update-text critical">
                        <span (click)="getUpdate()" [style.cursor]="'pointer'">{{ 'SIDEBAR.UPDATE.CRITICAL' | translate }}</span>
                        <span style="font-size: 1rem">{{ 'SIDEBAR.UPDATE.IMPORTANT_HINT' | translate }}</span>
                    </div>
                    <i
                        [delay]="500"
                        class="icon update critical"
                        placement="right-bottom"
                        [tooltip]="'SIDEBAR.UPDATE.CRITICAL_TOOLTIP' | translate"
                        tooltipClass="update-tooltip critical"
                    ></i>
                </ng-container>
            </div>

            <div *ngIf="variablesService.daemon_state === 2 && variablesService.net_time_delta_median !== 0" class="update-container">
                <div class="update-text time-orange">
                    <span>{{ 'SIDEBAR.UPDATE.TIME' | translate }}</span>
                </div>
                <i
                    [delay]="500"
                    class="icon time-orange"
                    placement="right-bottom"
                    [tooltip]="'SIDEBAR.UPDATE.TIME_TOOLTIP' | translate"
                    tooltipClass="update-tooltip important"
                ></i>
            </div>
        </div>
    `,
    styles: [],
    standalone: true,
    imports: [CommonModule, TranslateModule, TooltipModule, MatIconModule],
})
export class SynchronizationStatusComponent {
    constructor(public variablesService: VariablesService, private backend: BackendService) {}

    getUpdate(): void {
        this.backend.openUrlInBrowser(DOWNLOADS_PAGE_URL);
    }
}
