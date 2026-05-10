import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardProgressComponent } from './wallet-card-progress.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../testing/default-component-test-providers';

describe('WalletCardProgressComponent', () => {
    let component: WalletCardProgressComponent;
    let fixture: ComponentFixture<WalletCardProgressComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WalletCardProgressComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(WalletCardProgressComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
