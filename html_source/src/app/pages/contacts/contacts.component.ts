import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { VariablesService } from '../../_helpers/services/variables.service';
import { BackendService } from '../../_helpers/services/backend.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  @ViewChild('head', { static: true }) head: ElementRef;

  calculatedWidth = [];

  constructor(
    private location: Location,
    public variablesService: VariablesService,
    private backend: BackendService
  ) {}

  ngOnInit(): void {
    this.backend.getContactAlias();
  }

  delete(index: number): void {
    if (this.variablesService.appPass) {
      this.variablesService.contacts.splice(index, 1);
      this.backend.storeSecureAppData();
    }
  }

  calculateWidth(): void {
    this.calculatedWidth = [];
    this.calculatedWidth.push(
      this.head.nativeElement.childNodes[0].clientWidth
    );
    this.calculatedWidth.push(
      this.head.nativeElement.childNodes[1].clientWidth +
        this.head.nativeElement.childNodes[2].clientWidth
    );
    this.calculatedWidth.push(
      this.head.nativeElement.childNodes[3].clientWidth
    );
    this.calculatedWidth.push(
      this.head.nativeElement.childNodes[4].clientWidth
    );
  }

  back(): void {
    this.location.back();
  }
}
