import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardButtonCloseComponent } from './wallet-card-button-close.component';

describe('WalletCardButtonCloseComponent', () => {
  let component: WalletCardButtonCloseComponent;
  let fixture: ComponentFixture<WalletCardButtonCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WalletCardButtonCloseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletCardButtonCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
