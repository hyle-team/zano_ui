import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTagComponent } from './asset-tag.component';

describe('AssetTagComponent', () => {
  let component: AssetTagComponent;
  let fixture: ComponentFixture<AssetTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AssetTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
