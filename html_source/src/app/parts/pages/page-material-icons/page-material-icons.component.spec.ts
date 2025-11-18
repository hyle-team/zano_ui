import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMaterialIconsComponent } from './page-material-icons.component';

describe('PageMaterialIconsComponent', () => {
  let component: PageMaterialIconsComponent;
  let fixture: ComponentFixture<PageMaterialIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PageMaterialIconsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageMaterialIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
