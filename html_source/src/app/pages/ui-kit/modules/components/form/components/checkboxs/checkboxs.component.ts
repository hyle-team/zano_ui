import { Component } from '@angular/core';

@Component({
  selector: 'app-checkboxs',
  template: `<h3 class="mb-2">Disabled = true</h3>
    <app-checkbox
      [disabled]="true"
      class="mb-1 max-w-50-rem w-100"
      label="LabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabel"
    ></app-checkbox>

    <h3 class="mb-2">Default</h3>
    <app-checkbox
      class="mb-1 max-w-50-rem w-100"
      label="Label"
    ></app-checkbox> `,
  styles: [],
})
export class CheckboxsComponent {}
