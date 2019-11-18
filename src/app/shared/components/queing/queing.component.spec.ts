import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueingComponent } from './queing.component';

describe('QueingComponent', () => {
  let component: QueingComponent;
  let fixture: ComponentFixture<QueingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
