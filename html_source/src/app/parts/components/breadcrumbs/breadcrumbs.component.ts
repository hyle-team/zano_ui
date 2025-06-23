import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbItems } from '@parts/components/breadcrumbs/breadcrumbs.models';

@Component({
    selector: 'app-breadcrumbs',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink],
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
    @Input() items: BreadcrumbItems = [];
}
