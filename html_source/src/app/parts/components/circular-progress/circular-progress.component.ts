import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-circular-progress',
    standalone: true,
    templateUrl: './circular-progress.component.html',
    styleUrls: ['./circular-progress.component.scss'],
})
export class CircularProgressComponent {
    private readonly _radius = 6.5;

    private readonly _circumference = 2 * Math.PI * this._radius;

    @Input() progress = 0;

    get progressNormalized(): number {
        if (Number.isNaN(this.progress)) return 0;
        return Math.min(100, Math.max(0, this.progress));
    }

    get dashArray(): number {
        return this._circumference;
    }

    get dashOffset(): number {
        return this._circumference - (this.progressNormalized / 100) * this._circumference;
    }
}
