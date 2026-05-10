import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrateAlertComponent } from './migrate-alert.component';
import { DEFAULT_COMPONENT_TEST_PROVIDERS } from '../../../testing/default-component-test-providers';

describe('MigrateAlertComponent', () => {
    let component: MigrateAlertComponent;
    let fixture: ComponentFixture<MigrateAlertComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MigrateAlertComponent],
            providers: DEFAULT_COMPONENT_TEST_PROVIDERS,
        }).compileComponents();

        fixture = TestBed.createComponent(MigrateAlertComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
