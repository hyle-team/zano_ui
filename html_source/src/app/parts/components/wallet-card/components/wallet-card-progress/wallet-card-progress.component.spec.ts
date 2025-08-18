import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardProgressComponent } from './wallet-card-progress.component';

describe('WalletCardProgressComponent', () => {
  let component: WalletCardProgressComponent;
  let fixture: ComponentFixture<WalletCardProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WalletCardProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletCardProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
