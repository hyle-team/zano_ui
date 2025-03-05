import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { RouterLinkWithHref } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-swap',
    standalone: true,
    imports: [CommonModule, FlexModule, RouterLinkWithHref, TranslateModule],
    templateUrl: './swap.component.html',
    styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
