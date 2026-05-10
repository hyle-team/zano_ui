import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTagComponent } from './asset-tag.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../testing/default-component-test-providers';

describe('AssetTagComponent', () => {
    let component: AssetTagComponent;
    let fixture: ComponentFixture<AssetTagComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AssetTagComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(AssetTagComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
