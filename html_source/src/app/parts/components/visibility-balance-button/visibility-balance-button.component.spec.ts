import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityBalanceButtonComponent } from './visibility-balance-button.component';

describe('VisibilityBalanceButtonComponent', () => {
    let component: VisibilityBalanceButtonComponent;
    let fixture: ComponentFixture<VisibilityBalanceButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VisibilityBalanceButtonComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(VisibilityBalanceButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
