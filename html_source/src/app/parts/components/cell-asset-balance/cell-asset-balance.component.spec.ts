import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellAssetBalanceComponent } from './cell-asset-balance.component';

describe('CellAssetBalanceComponent', () => {
  let component: CellAssetBalanceComponent;
  let fixture: ComponentFixture<CellAssetBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CellAssetBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellAssetBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
