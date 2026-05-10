import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMaterialIconsComponent } from './page-material-icons.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../testing/default-component-test-providers';

describe('PageMaterialIconsComponent', () => {
    let component: PageMaterialIconsComponent;
    let fixture: ComponentFixture<PageMaterialIconsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageMaterialIconsComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(PageMaterialIconsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
