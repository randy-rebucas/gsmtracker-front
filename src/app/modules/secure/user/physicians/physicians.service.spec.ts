import { TestBed } from '@angular/core/testing';

import { PhysiciansService } from './physicians.service';

describe('PhysiciansService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhysiciansService = TestBed.get(PhysiciansService);
    expect(service).toBeTruthy();
  });
});
