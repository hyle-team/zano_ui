import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomTokenComponent } from './add-custom-token.component';

describe('AddCustomTokenComponent', () => {
  let component: AddCustomTokenComponent;
  let fixture: ComponentFixture<AddCustomTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
