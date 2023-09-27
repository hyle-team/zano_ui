import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonModule } from '@parts/directives/back-button/back-button.module';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule, BackButtonModule],
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent {}
