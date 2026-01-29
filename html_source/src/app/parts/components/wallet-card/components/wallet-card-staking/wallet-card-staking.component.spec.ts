import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardStakingComponent } from './wallet-card-staking.component';

describe('WalletCardStakingComponent', () => {
    let component: WalletCardStakingComponent;
    let fixture: ComponentFixture<WalletCardStakingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WalletCardStakingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(WalletCardStakingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
