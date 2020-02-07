import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicianWidgetComponent } from './physician-widget.component';

describe('PhysicianWidgetComponent', () => {
  let component: PhysicianWidgetComponent;
  let fixture: ComponentFixture<PhysicianWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicianWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicianWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
