import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentFieldComponent } from './comment-field.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../../testing/default-component-test-providers';

describe('CommentFieldComponent', () => {
    let component: CommentFieldComponent;
    let fixture: ComponentFixture<CommentFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommentFieldComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(CommentFieldComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
