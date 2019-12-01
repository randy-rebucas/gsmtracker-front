import { TestBed } from '@angular/core/testing';

import { QueingService } from './queing.service';

describe('QueingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueingService = TestBed.get(QueingService);
    expect(service).toBeTruthy();
  });
});
