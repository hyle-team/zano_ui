import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardBalanceComponent } from './wallet-card-balance.component';

describe('WalletCardBalanceComponent', () => {
    let component: WalletCardBalanceComponent;
    let fixture: ComponentFixture<WalletCardBalanceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WalletCardBalanceComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(WalletCardBalanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
