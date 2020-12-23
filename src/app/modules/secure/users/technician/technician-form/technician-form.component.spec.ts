import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianFormComponent } from './technician-form.component';

describe('TechnicianFormComponent', () => {
  let component: TechnicianFormComponent;
  let fixture: ComponentFixture<TechnicianFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicianFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
