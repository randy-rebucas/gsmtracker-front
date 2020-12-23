import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianLookupComponent } from './technician-lookup.component';

describe('TechnicianLookupComponent', () => {
  let component: TechnicianLookupComponent;
  let fixture: ComponentFixture<TechnicianLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicianLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
