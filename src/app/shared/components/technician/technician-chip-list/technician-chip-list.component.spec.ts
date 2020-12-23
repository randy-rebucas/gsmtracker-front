import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianChipListComponent } from './technician-chip-list.component';

describe('TechnicianChipListComponent', () => {
  let component: TechnicianChipListComponent;
  let fixture: ComponentFixture<TechnicianChipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicianChipListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicianChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
