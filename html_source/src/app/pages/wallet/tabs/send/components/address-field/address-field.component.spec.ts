import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFieldComponent } from './address-field.component';

describe('AddressFieldComponent', () => {
    let component: AddressFieldComponent;
    let fixture: ComponentFixture<AddressFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddressFieldComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AddressFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
