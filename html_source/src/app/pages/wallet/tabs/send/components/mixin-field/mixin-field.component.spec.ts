import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixinFieldComponent } from './mixin-field.component';

describe('MixinFieldComponent', () => {
    let component: MixinFieldComponent;
    let fixture: ComponentFixture<MixinFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MixinFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MixinFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
