import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircularProgressComponent } from '@parts/components/circular-progress/circular-progress.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from '@parts/directives';
import { calculatePosProgress } from '@parts/functions/calculate-pos-progress';
import { calculatePosEstimateSec } from '@parts/functions/calculate-pos-estimate-sec';
import { EstimateTimePipe } from '@parts/pipes';
import { VariablesService } from '@parts/services/variables.service';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'app-staking-time-to-block-card',
    standalone: true,
    imports: [CommonModule, CircularProgressComponent, TranslateModule, TooltipDirective, EstimateTimePipe],
    templateUrl: './staking-time-to-block-card.component.html',
    styleUrls: ['./staking-time-to-block-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StakingTimeToBlockCardComponent {
    private readonly _variablesService: VariablesService = inject(VariablesService);

    readonly vm$ = combineLatest([
        this._variablesService.currentWalletChanged$.pipe(filter(Boolean)),
        this._variablesService.posStatusUpdated$,
    ]).pipe(
        filter(([wallet, wallet_id]) => wallet.wallet_id === wallet_id),
        map(([wallet]) => {
            const { current_pos_attempts, est_iterations_per_pos_block } = wallet;
            const isEstimateAvailable = est_iterations_per_pos_block > 0;

            return {
                progress: isEstimateAvailable ? calculatePosProgress(current_pos_attempts, est_iterations_per_pos_block) : 0,
                estimateSec: isEstimateAvailable ? calculatePosEstimateSec(current_pos_attempts, est_iterations_per_pos_block) : null,
                attempt: current_pos_attempts,
            };
        })
    );
}
