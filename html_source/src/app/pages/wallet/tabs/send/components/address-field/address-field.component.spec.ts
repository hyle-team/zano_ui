import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFieldComponent } from './address-field.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../../testing/default-component-test-providers';

describe('AddressFieldComponent', () => {
    let component: AddressFieldComponent;
    let fixture: ComponentFixture<AddressFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddressFieldComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(AddressFieldComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
