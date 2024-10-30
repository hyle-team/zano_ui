import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AliasControlsComponent } from './alias-controls.component';

describe('AliasControlsComponent', () => {
  let component: AliasControlsComponent;
  let fixture: ComponentFixture<AliasControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AliasControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AliasControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
