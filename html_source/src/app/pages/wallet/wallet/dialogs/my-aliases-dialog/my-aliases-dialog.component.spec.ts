import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAliasesDialogComponent } from './my-aliases-dialog.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../../../testing/default-component-test-providers';

describe('MyAliasesModalComponent', () => {
    let component: MyAliasesDialogComponent;
    let fixture: ComponentFixture<MyAliasesDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MyAliasesDialogComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(MyAliasesDialogComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
