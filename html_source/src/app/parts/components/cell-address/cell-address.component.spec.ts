import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellAddressComponent } from './cell-address.component';

describe('CellAddressComponent', () => {
    let component: CellAddressComponent;
    let fixture: ComponentFixture<CellAddressComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CellAddressComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CellAddressComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
