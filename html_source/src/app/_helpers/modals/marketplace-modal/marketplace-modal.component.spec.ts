import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceModalComponent } from './marketplace-modal.component';

describe('MarketplaceModalComponent', () => {
  let component: MarketplaceModalComponent;
  let fixture: ComponentFixture<MarketplaceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
