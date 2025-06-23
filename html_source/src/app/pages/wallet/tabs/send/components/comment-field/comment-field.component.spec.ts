import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentFieldComponent } from './comment-field.component';

describe('CommentFieldComponent', () => {
    let component: CommentFieldComponent;
    let fixture: ComponentFixture<CommentFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommentFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CommentFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
