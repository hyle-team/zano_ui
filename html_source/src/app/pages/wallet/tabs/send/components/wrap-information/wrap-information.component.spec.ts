import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapInformationComponent } from './wrap-information.component';

describe('WrapInformationComponent', () => {
    let component: WrapInformationComponent;
    let fixture: ComponentFixture<WrapInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WrapInformationComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(WrapInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
