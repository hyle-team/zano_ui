import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardNameComponent } from './wallet-card-name.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../testing/default-component-test-providers';

describe('WalletCardNameComponent', () => {
    let component: WalletCardNameComponent;
    let fixture: ComponentFixture<WalletCardNameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WalletCardNameComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(WalletCardNameComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
