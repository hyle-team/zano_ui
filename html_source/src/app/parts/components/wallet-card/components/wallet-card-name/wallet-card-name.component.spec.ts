import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardNameComponent } from './wallet-card-name.component';

describe('WalletCardNameComponent', () => {
  let component: WalletCardNameComponent;
  let fixture: ComponentFixture<WalletCardNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WalletCardNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletCardNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
