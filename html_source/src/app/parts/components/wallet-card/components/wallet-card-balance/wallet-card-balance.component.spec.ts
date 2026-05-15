import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardBalanceComponent } from './wallet-card-balance.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../testing/default-component-test-providers';

describe('WalletCardBalanceComponent', () => {
    let component: WalletCardBalanceComponent;
    let fixture: ComponentFixture<WalletCardBalanceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WalletCardBalanceComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(WalletCardBalanceComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
