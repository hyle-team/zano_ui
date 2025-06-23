import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeFieldComponent } from './fee-field.component';

describe('FeeFieldComponent', () => {
    let component: FeeFieldComponent;
    let fixture: ComponentFixture<FeeFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FeeFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeeFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
