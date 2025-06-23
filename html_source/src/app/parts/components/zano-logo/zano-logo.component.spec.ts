import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZanoLogoComponent } from './zano-logo.component';

describe('ZanoLogoComponent', () => {
    let component: ZanoLogoComponent;
    let fixture: ComponentFixture<ZanoLogoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZanoLogoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZanoLogoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
