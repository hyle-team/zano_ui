import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardButtonCloseComponent } from './wallet-card-button-close.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../testing/default-component-test-providers';

describe('WalletCardButtonCloseComponent', () => {
    let component: WalletCardButtonCloseComponent;
    let fixture: ComponentFixture<WalletCardButtonCloseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WalletCardButtonCloseComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(WalletCardButtonCloseComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
