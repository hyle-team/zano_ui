import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCardAliasComponent } from './wallet-card-alias.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../testing/default-component-test-providers';

describe('WalletCardAliasComponent', () => {
    let component: WalletCardAliasComponent;
    let fixture: ComponentFixture<WalletCardAliasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WalletCardAliasComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(WalletCardAliasComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
