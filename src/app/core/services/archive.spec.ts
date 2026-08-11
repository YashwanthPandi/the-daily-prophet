import { TestBed } from '@angular/core/testing';

import { Archive } from './archive';

describe('Archive', () => {
  let service: Archive;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Archive);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
