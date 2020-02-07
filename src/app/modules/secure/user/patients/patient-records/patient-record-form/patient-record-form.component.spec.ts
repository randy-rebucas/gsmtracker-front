import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRecordFormComponent } from './patient-record-form.component';

describe('PatientRecordFormComponent', () => {
  let component: PatientRecordFormComponent;
  let fixture: ComponentFixture<PatientRecordFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientRecordFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRecordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
