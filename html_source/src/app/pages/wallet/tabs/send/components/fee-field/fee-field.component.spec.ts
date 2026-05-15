import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeFieldComponent } from './fee-field.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../../testing/default-component-test-providers';

describe('FeeFieldComponent', () => {
    let component: FeeFieldComponent;
    let fixture: ComponentFixture<FeeFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeeFieldComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(FeeFieldComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
