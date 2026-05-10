import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDetailsComponent } from './additional-details.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../../testing/default-component-test-providers';

describe('AdditionalDetailsComponent', () => {
    let component: AdditionalDetailsComponent;
    let fixture: ComponentFixture<AdditionalDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdditionalDetailsComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(AdditionalDetailsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
