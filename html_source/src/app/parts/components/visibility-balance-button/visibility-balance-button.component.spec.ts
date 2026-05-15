import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityBalanceButtonComponent } from './visibility-balance-button.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../testing/default-component-test-providers';

describe('VisibilityBalanceButtonComponent', () => {
    let component: VisibilityBalanceButtonComponent;
    let fixture: ComponentFixture<VisibilityBalanceButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VisibilityBalanceButtonComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(VisibilityBalanceButtonComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
