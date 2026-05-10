import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationsComponent } from './destinations.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../../testing/default-component-test-providers';

describe('DestinationsComponent', () => {
    let component: DestinationsComponent;
    let fixture: ComponentFixture<DestinationsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DestinationsComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(DestinationsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
