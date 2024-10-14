import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrateAlertComponent } from './migrate-alert.component';

describe('MigrateAlertComponent', () => {
  let component: MigrateAlertComponent;
  let fixture: ComponentFixture<MigrateAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MigrateAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrateAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
