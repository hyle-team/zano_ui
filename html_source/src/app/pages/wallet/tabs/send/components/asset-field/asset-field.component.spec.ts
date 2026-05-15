import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetFieldComponent } from './asset-field.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../../testing/default-component-test-providers';

describe('AssetFieldComponent', () => {
    let component: AssetFieldComponent;
    let fixture: ComponentFixture<AssetFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AssetFieldComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(AssetFieldComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
