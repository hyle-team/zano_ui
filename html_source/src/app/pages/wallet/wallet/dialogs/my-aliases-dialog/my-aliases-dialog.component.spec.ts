import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAliasesDialogComponent } from './my-aliases-dialog.component';

describe('MyAliasesModalComponent', () => {
    let component: MyAliasesDialogComponent;
    let fixture: ComponentFixture<MyAliasesDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MyAliasesDialogComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(MyAliasesDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
