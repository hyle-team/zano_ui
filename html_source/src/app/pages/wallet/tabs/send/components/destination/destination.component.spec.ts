import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationComponent } from './destination.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../../testing/default-component-test-providers';

describe('DestinationComponent', () => {
    let component: DestinationComponent;
    let fixture: ComponentFixture<DestinationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DestinationComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(DestinationComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
