import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixinFieldComponent } from './mixin-field.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../../testing/default-component-test-providers';

describe('MixinFieldComponent', () => {
    let component: MixinFieldComponent;
    let fixture: ComponentFixture<MixinFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MixinFieldComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(MixinFieldComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
