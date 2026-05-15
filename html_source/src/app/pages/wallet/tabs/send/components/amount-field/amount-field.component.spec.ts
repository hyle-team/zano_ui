import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountFieldComponent } from './amount-field.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../../testing/default-component-test-providers';

describe('AmountFieldComponent', () => {
    let component: AmountFieldComponent;
    let fixture: ComponentFixture<AmountFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AmountFieldComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(AmountFieldComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
