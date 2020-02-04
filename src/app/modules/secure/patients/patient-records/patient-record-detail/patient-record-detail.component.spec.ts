import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRecordDetailComponent } from './patient-record-detail.component';

describe('PatientRecordDetailComponent', () => {
  let component: PatientRecordDetailComponent;
  let fixture: ComponentFixture<PatientRecordDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientRecordDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
