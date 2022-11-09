import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-token',
  templateUrl: './card-token.component.html',
  styleUrls: ['./card-token.component.scss']
})
export class CardTokenComponent implements OnInit {
  openDropdown = false;

  constructor() {
  }

  ngOnInit() {
  }

  toggleMenuDropdown(): void {
    this.openDropdown = !this.openDropdown;
  }
}
