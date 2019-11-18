import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxPadComponent } from './rx-pad.component';

describe('RxPadComponent', () => {
  let component: RxPadComponent;
  let fixture: ComponentFixture<RxPadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxPadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
