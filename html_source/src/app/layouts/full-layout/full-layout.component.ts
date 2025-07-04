import { Component } from '@angular/core';

@Component({
    selector: 'app-full-layout',
    templateUrl: './full-layout.component.html',
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        `,
    ],
})
export class FullLayoutComponent {}
