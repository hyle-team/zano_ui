import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'estimateTime',
    standalone: true,
    pure: false,
})
export class EstimateTimePipe implements PipeTransform {
    constructor(private readonly translate: TranslateService) {}

    transform(estimateSec: number | null | undefined): string {
        if (!Number.isFinite(estimateSec) || estimateSec === null || estimateSec === undefined || estimateSec < 0) {
            return this.translate.instant('ESTIMATE_TIME.NA');
        }

        if (estimateSec < 60) {
            return this.translate.instant('ESTIMATE_TIME.LESS_THAN_MINUTE');
        }

        if (estimateSec >= 86400) {
            return `~ ${Math.max(1, Math.round(estimateSec / 86400))} ${this.translate.instant('ESTIMATE_TIME.UNITS.DAY')}`;
        }

        if (estimateSec >= 3600) {
            return `~ ${Math.max(1, Math.round(estimateSec / 3600))} ${this.translate.instant('ESTIMATE_TIME.UNITS.HOUR')}`;
        }

        return `~ ${Math.max(1, Math.round(estimateSec / 60))} ${this.translate.instant('ESTIMATE_TIME.UNITS.MIN')}`;
    }
}
