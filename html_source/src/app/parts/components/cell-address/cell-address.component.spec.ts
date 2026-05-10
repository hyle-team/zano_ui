import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellAddressComponent } from './cell-address.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../testing/default-component-test-providers';

describe('CellAddressComponent', () => {
    let component: CellAddressComponent;
    let fixture: ComponentFixture<CellAddressComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CellAddressComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(CellAddressComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
