import { Component } from '@angular/core';
import { scaleItems } from 'src/app/_helpers/data/scale-items';
import { ScaleItems } from 'src/app/_helpers/models/scale.model';

@Component({
  selector: 'app-selects',
  templateUrl: './selects.component.html',
  styleUrls: ['./selects.component.scss'],
})
export class SelectsComponent {
  scaleItems: ScaleItems = [...scaleItems];
}
