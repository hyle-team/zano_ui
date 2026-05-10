import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZanoLogoComponent } from './zano-logo.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../testing/default-component-test-providers';

describe('ZanoLogoComponent', () => {
    let component: ZanoLogoComponent;
    let fixture: ComponentFixture<ZanoLogoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZanoLogoComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(ZanoLogoComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
