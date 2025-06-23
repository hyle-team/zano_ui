import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnotherDestinationButtonComponent } from './add-another-destination-button.component';

describe('AddAnotherDestinationButtonComponent', () => {
    let component: AddAnotherDestinationButtonComponent;
    let fixture: ComponentFixture<AddAnotherDestinationButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddAnotherDestinationButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AddAnotherDestinationButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
