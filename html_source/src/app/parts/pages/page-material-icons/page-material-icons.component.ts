import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { zanoIcons } from '../../../../assets/zano-icons';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'zano-page-material-icons',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './page-material-icons.component.html',
    styleUrls: ['./page-material-icons.component.scss'],
})
export class PageMaterialIconsComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    materialZanoIcons = zanoIcons;
}
