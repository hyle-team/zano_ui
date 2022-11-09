import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollXComponent } from './scroll-x.component';

describe('ScrollXComponent', () => {
  let component: ScrollXComponent;
  let fixture: ComponentFixture<ScrollXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
