import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapInformationComponent } from './wrap-information.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../../testing/default-component-test-providers';

describe('WrapInformationComponent', () => {
    let component: WrapInformationComponent;
    let fixture: ComponentFixture<WrapInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WrapInformationComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(WrapInformationComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
