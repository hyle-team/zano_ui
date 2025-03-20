import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetFieldComponent } from './asset-field.component';

describe('AssetFieldComponent', () => {
    let component: AssetFieldComponent;
    let fixture: ComponentFixture<AssetFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AssetFieldComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AssetFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
