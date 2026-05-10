import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardStakingComponent } from './wallet-card-staking.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../testing/default-component-test-providers';

describe('WalletCardStakingComponent', () => {
    let component: WalletCardStakingComponent;
    let fixture: ComponentFixture<WalletCardStakingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WalletCardStakingComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(WalletCardStakingComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
