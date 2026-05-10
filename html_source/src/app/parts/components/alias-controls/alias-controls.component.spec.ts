import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliasControlsComponent } from './alias-controls.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../testing/default-component-test-providers';

describe('AliasControlsComponent', () => {
    let component: AliasControlsComponent;
    let fixture: ComponentFixture<AliasControlsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AliasControlsComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(AliasControlsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
