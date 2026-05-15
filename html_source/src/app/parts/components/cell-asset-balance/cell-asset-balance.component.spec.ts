import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellAssetBalanceComponent } from './cell-asset-balance.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../testing/default-component-test-providers';

describe('CellAssetBalanceComponent', () => {
    let component: CellAssetBalanceComponent;
    let fixture: ComponentFixture<CellAssetBalanceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CellAssetBalanceComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(CellAssetBalanceComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
