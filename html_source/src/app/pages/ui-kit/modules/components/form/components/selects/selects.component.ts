import { Component } from '@angular/core';
import { scaleItems } from 'src/app/parts/data/scale-items';
import { ScaleItems } from 'src/app/api/models/scale.model';

@Component({
  selector: 'app-selects',
  template: `
    <div class="form__field mb-2">
      <label>Default</label>
      <ng-select
        [clearable]="false"
        [items]="scaleItems"
        [searchable]="false"
        bindLabel="name"
        bindValue="value"
      >
        <ng-template let-item="item" ng-label-tmp>
          {{ item.name | translate }}
        </ng-template>
        <ng-template let-index="index" let-item="item" ng-option-tmp>
          {{ item.name | translate }}
        </ng-template>
      </ng-select>
    </div>

    <div class="form__field">
      <label>With circle</label>
      <ng-select
        [clearable]="false"
        [items]="scaleItems"
        [searchable]="false"
        bindLabel="name"
        bindValue="value"
        class="with-circle"
      >
        <ng-template let-item="item" ng-label-tmp>
          {{ item.name | translate }}
        </ng-template>
        <ng-template let-index="index" let-item="item" ng-option-tmp>
          {{ item.name | translate }}
        </ng-template>
      </ng-select>
    </div>

    <h3 class="mb-1">
      if you use formControlName class ng-invalid set red border if select
      ng-touched
    </h3>
    <div class="form__field">
      <label>With error</label>
      <ng-select
        [clearable]="false"
        [items]="scaleItems"
        [searchable]="false"
        bindLabel="name"
        bindValue="value"
        class="with-circle invalid"
      >
        <ng-template let-item="item" ng-label-tmp>
          {{ item.name | translate }}
        </ng-template>
        <ng-template let-index="index" let-item="item" ng-option-tmp>
          {{ item.name | translate }}
        </ng-template>
      </ng-select>
    </div>
  `,
  styles: [],
})
export class SelectsComponent {
  scaleItems: ScaleItems = [...scaleItems];
}
